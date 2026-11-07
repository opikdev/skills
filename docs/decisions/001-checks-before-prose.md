# 001. Enforce with checks before prose

- **Status**: accepted
- **Context**: An audit on 2026-11-07 found skills loaded in under half of relevant Claude sessions, and only Orbit had enforcing hooks. After the git skill loaded, trailers fell from 14% to 0.3% of commit commands, but bare `git add` stayed common. The sample was 60 sessions and not controlled.
- **Decision**: Automate each rule that a machine can verify, and run it in hooks and CI. Keep skills for judgment, and keep AGENTS.md to what agents can't discover.
- **Consequences**:
  - Agents get faster, repeatable feedback, and CI works with any agent.
  - Each rule now has tooling to maintain.
  - Skills stay in place until checks cover each project, because other projects still rely on the prose.
  - GEO stays light guidance, because the evidence is thin.

## Evidence

- [Anthropic best practices](https://code.claude.com/docs/en/best-practices): rules with no exceptions belong in hooks.
- [Böckeler, Harness engineering](https://martinfowler.com/articles/harness-engineering.html): pair guides with sensors.
- [Gloaguen et al.](https://arxiv.org/abs/2602.11988): context files added over 20% cost with no general success gain.
- [McMillan](https://arxiv.org/pdf/2605.10039): file size had no detectable effect on adherence, and compliance fell during sessions.
- [Khatri](https://arxiv.org/pdf/2607.27250): context strategy did not measurably change correctness.
- [Vercel evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals): an always-loaded index beat skills for APIs missing from training data.
- [Google on AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): AI search optimization is still SEO.
