# CI/CD Architecture & Deployment

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) architecture, automation pipelines, and deployment strategies used by Monynha Softwares.

## CI/CD Overview

### Pipeline Architecture

Monynha Softwares uses a comprehensive CI/CD pipeline that automates the entire software delivery lifecycle:

- **Continuous Integration**: Automated testing, linting, and building
- **Continuous Deployment**: Automated deployment to staging and production
- **Infrastructure as Code**: Automated infrastructure provisioning
- **Security Scanning**: Automated security vulnerability detection
- **Performance Monitoring**: Automated performance regression detection

### Technology Stack

- **CI/CD Platform**: GitHub Actions
- **Container Registry**: GitHub Container Registry (GHCR)
- **Infrastructure**: AWS with Terraform
- **Container Orchestration**: AWS ECS Fargate
- **Load Balancing**: AWS Application Load Balancer
- **CDN**: AWS CloudFront
- **Monitoring**: AWS CloudWatch + DataDog

## GitHub Actions Workflows

### Main CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run ESLint
        run: yarn lint

      - name: Run Prettier
        run: yarn format:check

      - name: Run TypeScript check
        run: yarn type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run database migrations
        run: yarn db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run unit tests
        run: yarn test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: yarn test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build applications
        run: yarn build

      - name: Build Docker images
        run: |
          docker build -t monynha/web:${{ github.sha }} apps/web
          docker build -t monynha/api:${{ github.sha }} apps/api
          docker build -t monynha/docs:${{ github.sha }} apps/docs

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Push Docker images
        run: |
          docker tag monynha/web:${{ github.sha }} ghcr.io/${{ github.repository }}/web:${{ github.sha }}
          docker tag monynha/api:${{ github.sha }} ghcr.io/${{ github.repository }}/api:${{ github.sha }}
          docker tag monynha/docs:${{ github.sha }} ghcr.io/${{ github.repository }}/docs:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}/web:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}/api:${{ github.sha }}
          docker push ghcr.io/${{ github.repository }}/docs:${{ github.sha }}

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  performance:
    name: Performance Test
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build for production
        run: yarn build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
          configPath: .lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security, performance]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to staging
        run: |
          aws ecs update-service --cluster monynha-staging --service web --force-new-deployment
          aws ecs update-service --cluster monynha-staging --service api --force-new-deployment
          aws ecs update-service --cluster monynha-staging --service docs --force-new-deployment

      - name: Run staging tests
        run: |
          npm install -g wait-on
          wait-on http://staging.monynha.com/api/health
          yarn test:e2e:staging

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security, performance]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to production
        run: |
          aws ecs update-service --cluster monynha-prod --service web --force-new-deployment
          aws ecs update-service --cluster monynha-prod --service api --force-new-deployment
          aws ecs update-service --cluster monynha-prod --service docs --force-new-deployment

      - name: Run production smoke tests
        run: |
          npm install -g wait-on
          wait-on https://monynha.com/api/health
          yarn test:smoke
```

### Pull Request Validation

```yaml
# .github/workflows/pr-validation.yml
name: PR Validation

on:
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  pr-checks:
    name: PR Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run linting
        run: yarn lint

      - name: Run type checking
        run: yarn type-check

      - name: Run unit tests
        run: yarn test:unit

      - name: Check test coverage
        run: yarn test:coverage --check-coverage --lines 80 --functions 80 --branches 75

      - name: Run security audit
        run: yarn audit --audit-level high

      - name: Check bundle size
        run: yarn build && yarn size-limit

  preview-deployment:
    name: Preview Deployment
    runs-on: ubuntu-latest
    needs: pr-checks
    if: github.event.pull_request.head.repo.full_name == github.repository
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build preview
        run: yarn build:preview

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Comment PR with preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployment ready: ${{ steps.vercel.outputs.preview-url }}`
            })
```

### Release Management

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build applications
        run: yarn build

      - name: Run tests
        run: yarn test

      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            ## Changes

            See [CHANGELOG.md](CHANGELOG.md) for details.

            ## Deployment

            This release has been automatically deployed to production.

      - name: Publish to npm
        if: contains(github.ref, 'apps/web') || contains(github.ref, 'packages/')
        run: |
          npm config set //registry.npmjs.org/:_authToken ${{ secrets.NPM_TOKEN }}
          yarn publish:packages

      - name: Update documentation
        run: |
          yarn docs:build
          yarn docs:deploy
```

## Infrastructure as Code

### Terraform Configuration

#### Main Infrastructure

```hcl
# infrastructure/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "monynha-terraform-state"
    key    = "infrastructure.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC Configuration
module "vpc" {
  source = "./modules/vpc"

  name = "monynha"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "monynha-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "monynha-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = var.environment == "prod"
}

# ECS Services
module "web_service" {
  source = "./modules/ecs-service"

  name           = "web"
  cluster_id     = aws_ecs_cluster.main.id
  vpc_id         = module.vpc.vpc_id
  subnets        = module.vpc.private_subnets
  alb_arn        = aws_lb.main.arn
  container_port = 3000
  host_port      = 80

  container_definitions = jsonencode([
    {
      name  = "web"
      image = "${var.container_registry}/web:${var.image_tag}"

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "API_URL", value = var.api_url }
      ]

      secrets = [
        { name = "DATABASE_URL", valueFrom = aws_ssm_parameter.database_url.arn },
        { name = "JWT_SECRET", valueFrom = aws_ssm_parameter.jwt_secret.arn }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.web.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "web"
        }
      }
    }
  ])
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "monynha-${var.environment}"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage = var.db_allocated_storage

  db_name  = "monynha"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = var.environment == "prod" ? 30 : 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  multi_az               = var.environment == "prod"
  skip_final_snapshot    = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "monynha-prod-final" : null

  enabled_cloudwatch_logs_exports = ["postgresql"]
}

# Redis Cluster
resource "aws_elasticache_cluster" "redis" {
  cluster_id      = "monynha-${var.environment}"
  engine          = "redis"
  node_type       = var.redis_node_type
  num_cache_nodes = var.environment == "prod" ? 2 : 1
  port            = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  snapshot_retention_limit = var.environment == "prod" ? 7 : 0
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "alb"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["*"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.main.arn
    ssl_support_method  = "sni-only"
  }
}
```

#### ECS Service Module

```hcl
# modules/ecs-service/main.tf
resource "aws_ecs_service" "main" {
  name            = var.name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = var.desired_count

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = var.name
    container_port   = var.container_port
  }

  network_configuration {
    subnets         = var.subnets
    security_groups = [aws_security_group.service.id]
  }

  depends_on = [aws_lb_listener.main]
}

resource "aws_ecs_task_definition" "main" {
  family                   = "${var.name}-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = var.container_definitions
}

resource "aws_lb_target_group" "main" {
  name        = "${var.name}-${var.environment}"
  port        = var.host_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener_rule" "main" {
  listener_arn = var.alb_arn
  priority     = var.priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }

  condition {
    path_pattern {
      values = var.path_patterns
    }
  }
}
```

### Environment Management

#### Staging Environment

```hcl
# environments/staging/main.tf
module "staging" {
  source = "../../infrastructure"

  environment = "staging"

  # Smaller instance sizes for staging
  web_cpu    = 256
  web_memory = 512
  api_cpu    = 512
  api_memory = 1024

  db_instance_class     = "db.t3.micro"
  db_allocated_storage  = 20
  redis_node_type       = "cache.t3.micro"

  # Staging-specific settings
  domain_name = "staging.monynha.com"
  enable_deletion_protection = false
}
```

#### Production Environment

```hcl
# environments/prod/main.tf
module "prod" {
  source = "../../infrastructure"

  environment = "prod"

  # Production instance sizes
  web_cpu    = 1024
  web_memory = 2048
  api_cpu    = 2048
  api_memory = 4096

  db_instance_class     = "db.r6g.large"
  db_allocated_storage  = 100
  redis_node_type       = "cache.r6g.large"

  # Production-specific settings
  domain_name = "monynha.com"
  enable_deletion_protection = true

  # High availability
  multi_az = true
}
```

## Deployment Strategies

### Blue-Green Deployment

```bash
#!/bin/bash
# deploy-blue-green.sh

set -e

ENVIRONMENT=$1
SERVICE=$2
IMAGE_TAG=$3

if [ -z "$ENVIRONMENT" ] || [ -z "$SERVICE" ] || [ -z "$IMAGE_TAG" ]; then
  echo "Usage: $0 <environment> <service> <image-tag>"
  exit 1
fi

CLUSTER_NAME="monynha-$ENVIRONMENT"
SERVICE_NAME="$SERVICE-$ENVIRONMENT"

# Get current task definition
CURRENT_TASK_DEF=$(aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --query 'services[0].taskDefinition' \
  --output text)

# Create new task definition with new image
NEW_TASK_DEF=$(aws ecs register-task-definition \
  --family $SERVICE_NAME \
  --container-definitions "[{
    \"name\": \"$SERVICE\",
    \"image\": \"ghcr.io/monynha/monynha/$SERVICE:$IMAGE_TAG\",
    \"essential\": true,
    \"portMappings\": [{
      \"containerPort\": 3000,
      \"hostPort\": 3000,
      \"protocol\": \"tcp\"
    }],
    \"environment\": [
      {\"name\": \"NODE_ENV\", \"value\": \"$ENVIRONMENT\"}
    ],
    \"logConfiguration\": {
      \"logDriver\": \"awslogs\",
      \"options\": {
        \"awslogs-group\": \"/ecs/$SERVICE-$ENVIRONMENT\",
        \"awslogs-region\": \"us-east-1\",
        \"awslogs-stream-prefix\": \"ecs\"
      }
    }
  }]" \
  --requires-compatibilities FARGATE \
  --network-mode awsvpc \
  --cpu 256 \
  --memory 512 \
  --execution-role-arn "arn:aws:iam::123456789012:role/ecsTaskExecutionRole" \
  --task-role-arn "arn:aws:iam::123456789012:role/ecsTaskRole" \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

# Update service to use new task definition
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $NEW_TASK_DEF \
  --force-new-deployment

# Wait for deployment to complete
echo "Waiting for deployment to complete..."
aws ecs wait services-stable \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME

# Run smoke tests
if [ "$ENVIRONMENT" = "prod" ]; then
  echo "Running production smoke tests..."
  npm run test:smoke
fi

# Clean up old task definitions (keep last 5)
OLD_TASK_DEFS=$(aws ecs list-task-definitions \
  --family-prefix $SERVICE_NAME \
  --sort DESC \
  --query 'taskDefinitionArns[5:]' \
  --output text)

if [ -n "$OLD_TASK_DEFS" ]; then
  echo "Cleaning up old task definitions..."
  for task_def in $OLD_TASK_DEFS; do
    aws ecs deregister-task-definition --task-definition $task_def
  done
fi

echo "Blue-green deployment completed successfully!"
```

### Canary Deployment

```typescript
// canary-deployment.ts
import { ECS, CloudWatch } from 'aws-sdk';

export class CanaryDeployment {
  private ecs = new ECS();
  private cloudwatch = new CloudWatch();

  async deployCanary(
    clusterName: string,
    serviceName: string,
    newTaskDefinition: string,
    canaryPercentage: number = 10
  ) {
    // Get current service configuration
    const service = await this.ecs.describeServices({
      cluster: clusterName,
      services: [serviceName]
    }).promise();

    const currentDesiredCount = service.services![0].desiredCount!;

    // Calculate canary instance count
    const canaryCount = Math.max(1, Math.floor(currentDesiredCount * canaryPercentage / 100));

    // Create canary service with new task definition
    const canaryServiceName = `${serviceName}-canary`;
    await this.ecs.createService({
      cluster: clusterName,
      serviceName: canaryServiceName,
      taskDefinition: newTaskDefinition,
      desiredCount: canaryCount,
      loadBalancers: service.services![0].loadBalancers,
      networkConfiguration: service.services![0].networkConfiguration
    }).promise();

    // Wait for canary to be healthy
    await this.waitForServiceHealthy(clusterName, canaryServiceName);

    // Monitor canary metrics
    const canaryHealthy = await this.monitorCanaryMetrics(clusterName, canaryServiceName);

    if (canaryHealthy) {
      // Gradually increase canary traffic
      await this.gradualTrafficShift(clusterName, serviceName, canaryServiceName, currentDesiredCount);
    } else {
      // Rollback canary
      await this.rollbackCanary(clusterName, canaryServiceName);
      throw new Error('Canary deployment failed health checks');
    }
  }

  private async waitForServiceHealthy(clusterName: string, serviceName: string): Promise<void> {
    // Wait for service to reach steady state
    await this.ecs.waitFor('servicesStable', {
      cluster: clusterName,
      services: [serviceName]
    }).promise();
  }

  private async monitorCanaryMetrics(clusterName: string, serviceName: string): Promise<boolean> {
    // Monitor error rates, response times, etc.
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 10 * 60 * 1000); // 10 minutes ago

    const metrics = await this.cloudwatch.getMetricData({
      MetricDataQueries: [
        {
          Id: 'errors',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/ECS',
              MetricName: 'CPUUtilization',
              Dimensions: [
                { Name: 'ClusterName', Value: clusterName },
                { Name: 'ServiceName', Value: serviceName }
              ]
            },
            Period: 300,
            Stat: 'Average'
          }
        }
      ],
      StartTime: startTime,
      EndTime: endTime
    }).promise();

    // Check if metrics are within acceptable ranges
    return this.analyzeMetrics(metrics);
  }

  private async gradualTrafficShift(
    clusterName: string,
    originalService: string,
    canaryService: string,
    totalCount: number
  ): Promise<void> {
    // Gradually shift traffic from original to canary
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      const canaryWeight = Math.floor((i / steps) * 100);
      const originalWeight = 100 - canaryWeight;

      // Update load balancer weights
      await this.updateLoadBalancerWeights(originalService, canaryService, originalWeight, canaryWeight);

      // Wait and monitor
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // 5 minutes

      const healthy = await this.monitorCanaryMetrics(clusterName, canaryService);
      if (!healthy) {
        await this.rollbackCanary(clusterName, canaryService);
        throw new Error(`Canary failed at ${canaryWeight}% traffic`);
      }
    }

    // Complete migration
    await this.ecs.updateService({
      cluster: clusterName,
      service: originalService,
      taskDefinition: canaryService, // This would be the new task definition
      desiredCount: totalCount
    }).promise();

    // Remove canary service
    await this.ecs.deleteService({
      cluster: clusterName,
      service: canaryService
    }).promise();
  }

  private async rollbackCanary(clusterName: string, canaryService: string): Promise<void> {
    // Scale down canary to 0
    await this.ecs.updateService({
      cluster: clusterName,
      service: canaryService,
      desiredCount: 0
    }).promise();

    // Delete canary service
    await this.ecs.deleteService({
      cluster: clusterName,
      service: canaryService
    }).promise();
  }
}
```

## Monitoring & Observability

### Application Monitoring

#### CloudWatch Dashboards

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", "ClusterName", "monynha-prod", "ServiceName", "web", { "stat": "Average" }],
          ["AWS/ECS", "CPUUtilization", "ClusterName", "monynha-prod", "ServiceName", "api", { "stat": "Average" }]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ECS CPU Utilization",
        "period": 300
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "MemoryUtilization", "ClusterName", "monynha-prod", "ServiceName", "web", { "stat": "Average" }],
          ["AWS/ECS", "MemoryUtilization", "ClusterName", "monynha-prod", "ServiceName", "api", { "stat": "Average" }]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ECS Memory Utilization",
        "period": 300
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/monynha-prod/1234567890abcdef", { "stat": "Sum" }],
          ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", "app/monynha-prod/1234567890abcdef", { "stat": "Sum" }],
          ["AWS/ApplicationELB", "HTTPCode_Target_4XX_Count", "LoadBalancer", "app/monynha-prod/1234567890abcdef", { "stat": "Sum" }]
        ],
        "view": "timeSeries",
        "stacked": false,
        "region": "us-east-1",
        "title": "ALB Request Metrics",
        "period": 300
      }
    }
  ]
}
```

#### DataDog Integration

```typescript
// datadog-monitoring.ts
import { dogapi } from '@datadog/datadog-api-client';

export class DataDogMonitoring {
  private metrics = new dogapi.MetricsApi();
  private configuration = dogapi.createConfiguration();

  constructor(apiKey: string, appKey: string) {
    this.configuration.apiKey = apiKey;
    this.configuration.appKey = appKey;
  }

  async submitCustomMetrics(metrics: CustomMetric[]) {
    const series = metrics.map(metric => ({
      metric: metric.name,
      points: [[Date.now() / 1000, metric.value]],
      tags: metric.tags,
      type: 1 // gauge
    }));

    await this.metrics.submitMetrics({
      body: { series }
    });
  }

  async createMonitor(monitor: MonitorConfig) {
    const monitorsApi = new dogapi.MonitorsApi(this.configuration);

    await monitorsApi.createMonitor({
      body: {
        name: monitor.name,
        type: monitor.type,
        query: monitor.query,
        message: monitor.message,
        tags: monitor.tags,
        options: {
          thresholds: monitor.thresholds,
          notifyNoData: true,
          noDataTimeframe: 10
        }
      }
    });
  }

  async sendEvent(event: EventData) {
    const eventsApi = new dogapi.EventsApi(this.configuration);

    await eventsApi.createEvent({
      body: {
        title: event.title,
        text: event.text,
        tags: event.tags,
        alertType: event.alertType,
        priority: event.priority
      }
    });
  }
}

// Usage
const monitoring = new DataDogMonitoring(process.env.DD_API_KEY!, process.env.DD_APP_KEY!);

// Submit custom metrics
await monitoring.submitCustomMetrics([
  {
    name: 'monynha.user.registrations',
    value: 1,
    tags: ['environment:prod', 'service:api']
  },
  {
    name: 'monynha.api.response_time',
    value: 150,
    tags: ['environment:prod', 'endpoint:/api/users']
  }
]);

// Create monitors
await monitoring.createMonitor({
  name: 'High Error Rate',
  type: 'metric alert',
  query: 'avg(last_5m):avg:aws.applicationelb.httpcode_target_5xx_count{loadbalancer:monynha-prod} > 10',
  message: 'Error rate is above 10 per minute',
  tags: ['team:backend', 'service:api'],
  thresholds: {
    critical: 10,
    warning: 5
  }
});
```

### Performance Monitoring

#### Synthetic Monitoring

```yaml
# .github/workflows/synthetic-monitoring.yml
name: Synthetic Monitoring

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  synthetic-tests:
    name: Synthetic Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run synthetic tests
        run: yarn test:synthetic
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}

      - name: Upload results to DataDog
        if: always()
        run: |
          yarn datadog:synthetic:upload
        env:
          DD_API_KEY: ${{ secrets.DD_API_KEY }}
          DD_APP_KEY: ${{ secrets.DD_APP_KEY }}
```

#### Real User Monitoring (RUM)

```typescript
// rum-tracking.ts
export class RUMTracker {
  private events: RUMEvent[] = [];

  trackPageView(page: string, userId?: string) {
    this.trackEvent({
      type: 'page_view',
      page,
      userId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  trackUserAction(action: string, metadata?: Record<string, any>) {
    this.trackEvent({
      type: 'user_action',
      action,
      metadata,
      timestamp: Date.now()
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent({
      type: 'error',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  trackPerformance(metric: PerformanceMetric) {
    this.trackEvent({
      type: 'performance',
      metric,
      timestamp: Date.now()
    });
  }

  private trackEvent(event: RUMEvent) {
    this.events.push(event);

    // Batch send events
    if (this.events.length >= 10) {
      this.flushEvents();
    }
  }

  private async flushEvents() {
    if (this.events.length === 0) return;

    try {
      await fetch('/api/rum/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: this.events,
          sessionId: this.getSessionId()
        })
      });

      this.events = [];
    } catch (error) {
      console.error('Failed to send RUM events:', error);
      // Keep events for retry
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('rum_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem('rum_session_id', sessionId);
    }
    return sessionId;
  }
}

// Initialize RUM tracking
const rumTracker = new RUMTracker();

// Track page views
window.addEventListener('load', () => {
  rumTracker.trackPageView(window.location.pathname);
});

// Track route changes (for SPAs)
if (typeof window.history !== 'undefined') {
  const originalPushState = window.history.pushState;
  window.history.pushState = function(state, title, url) {
    originalPushState.apply(this, arguments);
    rumTracker.trackPageView(url || window.location.pathname);
  };
}

// Track errors
window.addEventListener('error', (event) => {
  rumTracker.trackError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Track performance
window.addEventListener('load', () => {
  setTimeout(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    rumTracker.trackPerformance({
      type: 'navigation',
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
    });
  }, 0);
});
```

## Security in CI/CD

### Secret Management

#### AWS Secrets Manager Integration

```typescript
// secrets-manager.ts
import { SecretsManager } from 'aws-sdk';

export class SecretsManagerService {
  private client = new SecretsManager();

  async getSecret(secretName: string): Promise<string> {
    const response = await this.client.getSecretValue({
      SecretId: secretName
    }).promise();

    if (response.SecretString) {
      return response.SecretString;
    }

    throw new Error(`Secret ${secretName} not found`);
  }

  async getSecretJson<T = any>(secretName: string): Promise<T> {
    const secretString = await this.getSecret(secretName);
    return JSON.parse(secretString);
  }

  async createSecret(secretName: string, secretValue: string, description?: string) {
    await this.client.createSecret({
      Name: secretName,
      SecretString: secretValue,
      Description: description
    }).promise();
  }

  async updateSecret(secretName: string, secretValue: string) {
    await this.client.updateSecret({
      SecretId: secretName,
      SecretString: secretValue
    }).promise();
  }

  async rotateSecret(secretName: string) {
    await this.client.rotateSecret({
      SecretId: secretName
    }).promise();
  }
}
```

#### GitHub Secrets Management

```yaml
# .github/workflows/rotate-secrets.yml
name: Rotate Secrets

on:
  schedule:
    - cron: '0 0 1 * *'  # First day of every month
  workflow_dispatch:

jobs:
  rotate-secrets:
    name: Rotate Secrets
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Rotate database password
        run: |
          NEW_PASSWORD=$(openssl rand -base64 32)
          aws secretsmanager update-secret \
            --secret-id monynha/db-password \
            --secret-string "$NEW_PASSWORD"

          # Update RDS instance (this would trigger a restart)
          aws rds modify-db-instance \
            --db-instance-identifier monynha-prod \
            --master-user-password "$NEW_PASSWORD" \
            --apply-immediately

      - name: Rotate JWT secret
        run: |
          NEW_JWT_SECRET=$(openssl rand -hex 32)
          aws secretsmanager update-secret \
            --secret-id monynha/jwt-secret \
            --secret-string "$NEW_JWT_SECRET"

          # Trigger rolling update of ECS services
          aws ecs update-service --cluster monynha-prod --service api --force-new-deployment

      - name: Rotate API keys
        run: |
          NEW_API_KEY=$(openssl rand -hex 32)
          aws secretsmanager update-secret \
            --secret-id monynha/api-key \
            --secret-string "$NEW_API_KEY"

      - name: Send notification
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -H 'Content-type: application/json' \
            -d '{"text": "🔐 Secrets rotated successfully"}'
```

### Security Scanning

#### Container Image Scanning

```yaml
# .github/workflows/container-scan.yml
name: Container Security Scan

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/**/Dockerfile'
      - 'packages/**/Dockerfile'

jobs:
  scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker images
        run: |
          docker build -t monynha/web:scan apps/web
          docker build -t monynha/api:scan apps/api

      - name: Scan with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'image'
          scan-ref: 'monynha/web:scan,monynha/api:scan'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Scan with Snyk
        uses: snyk/actions/docker@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          image: monynha/web:scan
          args: --file=Dockerfile --severity-threshold=high

      - name: Fail on critical vulnerabilities
        if: failure()
        run: |
          echo "❌ Critical security vulnerabilities found!"
          echo "Please fix the vulnerabilities before merging."
          exit 1
```

#### Dependency Vulnerability Scanning

```yaml
# .github/workflows/dependency-scan.yml
name: Dependency Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  audit:
    name: Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run npm audit
        run: |
          if npm audit --audit-level high; then
            echo "✅ No high or critical vulnerabilities found"
          else
            echo "❌ High or critical vulnerabilities found"
            exit 1
          fi

      - name: Run Snyk test
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'Monynha'
          path: '.'
          format: 'ALL'
          args: >
            --enableRetired
            --enableExperimental
            --nvdValidForHours 24

      - name: Upload dependency check results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: dependency-check-report
          path: reports/
```

## Rollback Strategies

### Automated Rollback

```typescript
// rollback-service.ts
export class RollbackService {
  async rollbackDeployment(
    environment: string,
    service: string,
    targetVersion?: string
  ) {
    const clusterName = `monynha-${environment}`;
    const serviceName = `${service}-${environment}`;

    // Get current task definition
    const currentService = await this.ecs.describeServices({
      cluster: clusterName,
      services: [serviceName]
    }).promise();

    const currentTaskDef = currentService.services![0].taskDefinition!;

    // Find previous stable version
    let rollbackTaskDef: string;

    if (targetVersion) {
      // Rollback to specific version
      rollbackTaskDef = `${serviceName}:${targetVersion}`;
    } else {
      // Find previous task definition
      const taskDefs = await this.ecs.listTaskDefinitions({
        familyPrefix: serviceName,
        sort: 'DESC',
        maxResults: 10
      }).promise();

      // Skip current version and find previous stable one
      const currentVersion = currentTaskDef.split(':').pop();
      const previousVersions = taskDefs.taskDefinitionArns!
        .map(arn => arn.split(':').pop()!)
        .filter(version => version !== currentVersion)
        .slice(0, 3); // Check last 3 versions

      rollbackTaskDef = `${serviceName}:${previousVersions[0]}`;
    }

    // Update service to use rollback task definition
    await this.ecs.updateService({
      cluster: clusterName,
      service: serviceName,
      taskDefinition: rollbackTaskDef,
      forceNewDeployment: true
    }).promise();

    // Wait for deployment to complete
    await this.ecs.waitFor('servicesStable', {
      cluster: clusterName,
      services: [serviceName]
    }).promise();

    // Run health checks
    const healthy = await this.runHealthChecks(environment, service);

    if (!healthy) {
      throw new Error('Rollback failed - service is not healthy');
    }

    // Send notification
    await this.sendNotification(
      'rollback',
      `Successfully rolled back ${service} in ${environment} to ${rollbackTaskDef}`
    );

    return rollbackTaskDef;
  }

  async emergencyRollback(environment: string) {
    // Rollback all services to last known good state
    const services = ['web', 'api', 'docs'];

    for (const service of services) {
      try {
        await this.rollbackDeployment(environment, service);
      } catch (error) {
        console.error(`Failed to rollback ${service}:`, error);
        // Continue with other services
      }
    }
  }

  private async runHealthChecks(environment: string, service: string): Promise<boolean> {
    // Implement health checks
    const baseUrl = environment === 'prod' ? 'https://monynha.com' : `https://staging.monynha.com`;

    try {
      const response = await fetch(`${baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async sendNotification(type: string, message: string) {
    // Send notification to Slack, email, etc.
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}
```

### Deployment Monitoring

```typescript
// deployment-monitor.ts
export class DeploymentMonitor {
  async monitorDeployment(
    environment: string,
    service: string,
    deploymentId: string
  ) {
    const metrics = [];
    const alerts = [];

    // Monitor deployment progress
    const startTime = Date.now();

    while (true) {
      const status = await this.checkDeploymentStatus(environment, service);

      if (status === 'COMPLETED') {
        await this.recordSuccessfulDeployment(environment, service, deploymentId, startTime);
        break;
      } else if (status === 'FAILED') {
        await this.handleFailedDeployment(environment, service, deploymentId);
        break;
      }

      // Check metrics every 30 seconds
      const deploymentMetrics = await this.collectDeploymentMetrics(environment, service);

      metrics.push({
        timestamp: Date.now(),
        ...deploymentMetrics
      });

      // Check for alerts
      const newAlerts = this.analyzeMetricsForAlerts(metrics);
      alerts.push(...newAlerts);

      if (alerts.length > 0) {
        await this.escalateAlerts(alerts);
      }

      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    }
  }

  private async checkDeploymentStatus(environment: string, service: string): Promise<string> {
    // Check ECS service deployment status
    const clusterName = `monynha-${environment}`;
    const serviceName = `${service}-${environment}`;

    const service = await this.ecs.describeServices({
      cluster: clusterName,
      services: [serviceName]
    }).promise();

    const deployment = service.services![0].deployments![0];

    if (deployment.rolloutState === 'COMPLETED') {
      return 'COMPLETED';
    } else if (deployment.rolloutState === 'FAILED') {
      return 'FAILED';
    }

    return 'IN_PROGRESS';
  }

  private async collectDeploymentMetrics(environment: string, service: string) {
    // Collect CPU, memory, error rates, response times
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 5 * 60 * 1000); // Last 5 minutes

    const metrics = await this.cloudwatch.getMetricData({
      MetricDataQueries: [
        {
          Id: 'cpu',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/ECS',
              MetricName: 'CPUUtilization',
              Dimensions: [
                { Name: 'ClusterName', Value: `monynha-${environment}` },
                { Name: 'ServiceName', Value: `${service}-${environment}` }
              ]
            },
            Period: 300,
            Stat: 'Average'
          }
        },
        {
          Id: 'memory',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/ECS',
              MetricName: 'MemoryUtilization',
              Dimensions: [
                { Name: 'ClusterName', Value: `monynha-${environment}` },
                { Name: 'ServiceName', Value: `${service}-${environment}` }
              ]
            },
            Period: 300,
            Stat: 'Average'
          }
        }
      ],
      StartTime: startTime,
      EndTime: endTime
    }).promise();

    return {
      cpu: metrics.MetricDataResults?.find(m => m.Id === 'cpu')?.Values?.[0] || 0,
      memory: metrics.MetricDataResults?.find(m => m.Id === 'memory')?.Values?.[0] || 0
    };
  }

  private analyzeMetricsForAlerts(metrics: any[]): Alert[] {
    const alerts: Alert[] = [];
    const recentMetrics = metrics.slice(-5); // Last 5 data points

    // Check for high CPU usage
    const avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpu, 0) / recentMetrics.length;
    if (avgCpu > 80) {
      alerts.push({
        type: 'HIGH_CPU',
        message: `CPU usage is ${avgCpu.toFixed(1)}%`,
        severity: 'warning'
      });
    }

    // Check for high memory usage
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memory, 0) / recentMetrics.length;
    if (avgMemory > 85) {
      alerts.push({
        type: 'HIGH_MEMORY',
        message: `Memory usage is ${avgMemory.toFixed(1)}%`,
        severity: 'warning'
      });
    }

    return alerts;
  }

  private async escalateAlerts(alerts: Alert[]) {
    for (const alert of alerts) {
      if (alert.severity === 'critical') {
        // Immediate notification
        await this.sendCriticalAlert(alert);
      } else if (alert.severity === 'warning') {
        // Warning notification
        await this.sendWarningAlert(alert);
      }
    }
  }
}
```

This CI/CD architecture provides a robust, secure, and automated deployment pipeline that ensures high availability, fast feedback, and reliable releases for the Monynha Softwares platform.