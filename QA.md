# Karsa validation — 2026-10-26

## Automated checks

- JavaScript syntax check.
- Five Node tests: project creation has no automatic tasks; manual task/checklist completion and reopening; completed project visibility and JSON round-trip; malformed backup rejection; project deletion cascades only its own tasks.

## Browser validation

Tested through Sites local preview in Chrome.

- Created a new project: empty task state, 0% progress.
- Created a task manually with notes and two checklist steps.
- Completed checklist steps and changed status to in progress. Reload retained the notes, status, and both checked steps. Checklist completion alone did not complete the task.
- Completed task: project progress changed from 0% to 100%.
- Marked project completed: removed from the active overview, remained discoverable through global search.
- Continue opened the selected project detail without creating tasks or starting work automatically.
- At phone width 390px: navigated bottom tabs, created a task, opened its detail, added an additional checklist step, and filtered tasks and projects by name.
- At tablet width 768px: inspected layout and cross-tab updates.
- At desktop width 1348px: inspected the overview and modal forms.
- Phone document widths matched their scroll widths on overview, task detail, tasks, and projects, with no horizontal overflow.
- Fixed local HTTP compatibility: UUID generation falls back to crypto.getRandomValues when randomUUID is unavailable.

## Limits

Data persists per browser and origin, without cross-device synchronization. Export/import provides a manual transfer mechanism. Backup parser round-trip and invalid-data rejection were tested; file chooser restore and destructive UI delete/clear were not exercised. The temporary responsive QA harness is excluded from deployment. Sample records are shipped; browser QA records remain only in the local preview browser, outside the source and deployed assets.
