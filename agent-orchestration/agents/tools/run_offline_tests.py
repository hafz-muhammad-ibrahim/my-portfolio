"""Run e2e-standards/run_offline.sh and return parsed JSON report."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

# Allow running as module or script
_AGENTS = Path(__file__).resolve().parents[1]
if str(_AGENTS) not in sys.path:
    sys.path.insert(0, str(_AGENTS))

from config import E2E_STANDARDS_PATH


def run_offline_tests() -> dict:
    script = E2E_STANDARDS_PATH / "run_offline.sh"
    if not script.is_file():
        return {
            "overall": "FAIL",
            "error": f"Missing script: {script}",
            "hint": "Set E2E_STANDARDS_PATH in agents/.env",
        }

    result = subprocess.run(
        ["bash", str(script)],
        cwd=str(E2E_STANDARDS_PATH),
        capture_output=True,
        text=True,
        timeout=600,
    )

    report_path = E2E_STANDARDS_PATH / "reports" / "latest.json"
    if report_path.is_file():
        report = json.loads(report_path.read_text(encoding="utf-8"))
        report["_exit_code"] = result.returncode
        report["_stderr_tail"] = (result.stderr or "")[-500:]
        return report

    return {
        "overall": "FAIL",
        "error": "No latest.json produced",
        "stdout_tail": (result.stdout or "")[-500:],
        "stderr_tail": (result.stderr or "")[-500:],
        "exit_code": result.returncode,
    }


def main() -> None:
    report = run_offline_tests()
    print(json.dumps(report, indent=2))
    raise SystemExit(0 if report.get("overall") == "PASS" else 1)


if __name__ == "__main__":
    main()
