# Security Incident Playbook (Practical)

This playbook provides a concise, actionable incident response runbook tailored for development and on-call teams. It is a practical companion to `security.md` and is written for engineers who must respond to incidents quickly and safely.

1. Detection & Triage
----------------------
- Triage the alert: collect the alert source (SIEM, Sentry, CloudWatch), timestamps, affected services, and initial severity.
- Quickly determine scope: which services, regions, customers, or data stores are affected.
- Assign an incident lead and communicate a dedicated incident channel (Slack/Teams) and bridge.

2. Containment
--------------
- Short-term containment: apply network rules or scaling actions to limit blast radius (e.g., restrict ingress/IP, disable public endpoints, scale down worker concurrency).
- Credential containment: rotate compromised keys immediately using Secrets Manager; revoke tokens and sessions for affected services.

3. Investigation
----------------
- Preserve evidence: export logs, tracer spans, and relevant DB snapshots to an isolated storage location.
- Identify initial root cause: review recent deployments, config changes, and secret rotations.
- Use tooling: run `grep` across recent commits, check CI job logs, and inspect audit trails in the cloud provider.

4. Eradication
--------------
- Remove malicious actors or faulty code: rollback to last known good release or patch the offending code path.
- Patch vulnerabilities: upgrade dependencies, fix input validation, or adjust firewall rules as required.

5. Recovery
-----------
- Bring services back to normal using blue/green or canary deployments.
- Validate with smoke tests and automated health checks before full traffic cutover.

6. Post-Incident Review
-----------------------
- Run a blameless postmortem with timelines, root cause, actions taken, and follow-ups.
- Track follow-ups as issues with owners and deadlines.

Quick containment commands (examples)
-------------------------------------
- Revoke AWS access key (example):
  - aws iam update-access-key --user-name X --access-key-id AKIA... --status Inactive
- Rotate secret in AWS Secrets Manager (example):
  - aws secretsmanager rotate-secret --secret-id arn:aws:secretsmanager:... --rotation-lambda-arn arn:aws:lambda:...
- Emergency rollback (example):
  - aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment --task-definition my-task:42

Checklist: What to log
----------------------
- Alert ID, timestamps, services, owner, and channel
- Short description and initial impact estimate
- Evidence collected (logs, snapshots)
- Actions taken and by whom
- Final resolution and follow-up items

Escalation matrix (example)
---------------------------
- Level 1: On-call engineer (first 15 minutes)  
- Level 2: Service owner / Tech lead (15–60 minutes)  
- Level 3: Engineering manager + Security lead (60+ minutes)  

References
----------
- NIST Computer Security Incident Handling Guide (SP 800-61)  
- OWASP Incident Response Recommendations  
- Internal `security.md` for standards and policies
