# National Health AI Readiness and Triage Copilot

## Purpose

Build a portfolio-grade AI engineering capstone that demonstrates production readiness, data validation, model evaluation, API serving, monitoring, RAG, and responsible deployment patterns using only synthetic or public-safe data.

## Problem Statement

Health-system teams need reliable tools to identify data quality gaps, prioritize operational risks, and support decision-making. This project creates a synthetic AI copilot that evaluates readiness signals, produces transparent recommendations, and documents the full deployment workflow.

## Scope

The capstone should include:

- synthetic data generation
- FHIR-shaped resource examples
- data validation
- baseline predictive model
- API serving layer
- RAG assistant over public or synthetic guidance
- monitoring metrics
- error analysis
- model card
- data card
- deployment runbook

## Example Synthetic Inputs

- facility profile
- weekly service volume
- stock availability
- workforce capacity
- referral delays
- data completeness
- reporting timeliness
- coded observations

## Technical Architecture

```text
synthetic data generator
        |
        v
data validation and quality report
        |
        v
feature pipeline
        |
        v
baseline model + evaluation
        |
        v
FastAPI inference service
        |
        +--> monitoring logs
        |
        +--> RAG assistant over public/synthetic guidance
```

## Deliverables

| Deliverable | What It Proves |
| --- | --- |
| Synthetic dataset | Can create safe, representative learning data |
| FHIR-shaped examples | Understands interoperability concepts |
| Data quality report | Can validate readiness and detect gaps |
| Baseline model | Can train and evaluate a model responsibly |
| API service | Can deploy inference in a usable interface |
| Monitoring plan | Can operate AI after deployment |
| RAG assistant | Can ground generation in source material |
| Model card | Can document model behavior and limitations |
| Data card | Can document dataset origin, quality, and constraints |
| Runbook | Can support release, incident response, and rollback |

## Evaluation Metrics

- accuracy
- precision and recall
- calibration
- subgroup performance
- latency
- error rate
- data completeness
- drift indicators
- retrieval relevance
- grounded answer rate

## Privacy Boundary

Do not use real patient data, confidential employer data, credentials, employee information, customer information, private health records, or non-public metrics.

## Milestones

1. Define synthetic schema
2. Generate sample data
3. Add validation checks
4. Train baseline model
5. Build inference API
6. Add RAG workflow
7. Add monitoring outputs
8. Write model card, data card, and runbook
9. Publish sanitized portfolio writeup
