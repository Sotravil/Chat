export function initSingleOpenSettings() {
    const summaries = document.querySelectorAll('.settings-section summary');

    summaries.forEach(summary => {
        summary.addEventListener('click', () => {
            summaries.forEach(otherSummary => {
                if (otherSummary !== summary) {
                    const details = otherSummary.parentElement;
                    if (details && details.open) {
                        details.open = false;
                    }
                }
            });
        });
    });
}