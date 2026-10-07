# Café scenario reference traces

Generated with `node tools/cafe-scenario/probe.mjs`; seed 17, 100 ms ticks. Reference calculation only, not a browser run.

| Run (180 s) | Admitted | Exited | Cleaned visits | Passed by | Max queue | Max pickup | Ready dish-seconds | Dirty table-seconds | Max job wait (s) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 25 | 17 | 16 | 22 | 6 | 1 | 20.0 | 131.0 | 5.0 |
| kitchen-first | 30 | 21 | 21 | 17 | 6 | 1 | 6.0 | 108.0 | 4.0 |
| helper-first | 30 | 22 | 21 | 17 | 6 | 0 | 0.0 | 106.0 | 0.0 |
| fast-only | 25 | 18 | 16 | 22 | 6 | 1 | 66.0 | 138.0 | 4.0 |
| helper-only | 27 | 19 | 19 | 20 | 6 | 0 | 0.0 | 95.0 | 0.0 |
| admission-pause | 25 | 17 | 16 | 22 | 6 | 1 | 20.0 | 131.0 | 5.0 |

Baseline first delivery: 9.1s; first exit: 18.1s; first cleaned-table reuse: 23.1s.

| Snapshot (s) | Run | Queue | Active visit records | Admitted | Exited | Cleaned visits |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 30 | baseline | 6 | 9 | 10 | 2 | 1 |
| 30 | admission-pause | 6 | 9 | 10 | 2 | 1 |
| 60 | baseline | 6 | 9 | 13 | 5 | 4 |
| 60 | admission-pause | 3 | 6 | 10 | 5 | 4 |
| 90 | baseline | 6 | 9 | 16 | 8 | 7 |
| 90 | admission-pause | 0 | 3 | 10 | 8 | 7 |
| 120 | baseline | 6 | 9 | 19 | 11 | 10 |
| 120 | admission-pause | 4 | 7 | 17 | 11 | 10 |
| 180 | baseline | 6 | 9 | 25 | 17 | 16 |
| 180 | admission-pause | 6 | 9 | 25 | 17 | 16 |
