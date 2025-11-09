# FACODI

## Overview

FACODI (Faculdade Comunitária Digital) is an online learning environment offering asynchronous courses, live cohorts, and mentorship for Portuguese-speaking communities. The platform focuses on accessibility, affordability, and community-driven learning.

## Value proposition

- Democratise access to technology education and entrepreneurial training.
- Provide modular curricula aligned with local job market needs.
- Build a mentorship network pairing students with industry professionals.

## Core experience

1. **Learning paths** – Sequenced modules combining video, readings, and interactive assessments.
2. **Community spaces** – Forums, study groups, and mentor office hours with moderation tools.
3. **Certification** – Verifiable completion certificates and digital badges.
4. **Partner programs** – White-label offerings for NGOs, schools, and municipalities.

## Platform architecture

- **Backend**: Django with PostgreSQL, leveraging Django REST Framework for APIs.
- **Frontend**: Next.js client consuming REST endpoints and rendering MDX course content.
- **Realtime**: Pusher channels for live classrooms and chat.
- **Analytics**: Metabase dashboards visualising engagement, retention, and graduation metrics.

## Compliance & accessibility

- Meets WCAG 2.1 AA with screen-reader friendly navigation and captioned media.
- Stores learner data within EU data centres and respects GDPR consent requirements.
- Implements secure exam proctoring using timed assessments and device fingerprinting.

## Roadmap

| Initiative | Goal | Status |
| --- | --- | --- |
| Mentor marketplace | Match learners with mentors using availability calendars. | Development |
| Offline access | Allow course downloads within the mobile app. | Discovery |
| Scholarship engine | Automate scholarship eligibility and onboarding. | Planned |

## Contribution guidelines

- Coordinate curriculum changes with the academic board before editing content repositories.
- Add unit tests for Django services and Playwright regression tests for key learner journeys.
- Provide Portuguese and English copy when altering UI strings.
- Document data migrations and run them against staging before requesting production deploys.
