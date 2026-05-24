import useTrackingStore from '../store/useTrackingStore';

/**
 * Serializes all store data to a JSON blob and triggers a browser file download.
 */
export function exportData() {
  const { goals, phases, tasks, todos } = useTrackingStore.getState();
  const data = { goals, phases, tasks, todos };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `trackme-export-${Date.now()}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

/**
 * Validates JSON structure and replaces all store data.
 * Throws a descriptive Error if validation fails.
 *
 * @param {string} jsonString - The JSON string to import.
 */
export function importData(jsonString) {
  const parsed = JSON.parse(jsonString);

  const requiredKeys = ['goals', 'phases', 'tasks', 'todos'];
  const missingKeys = requiredKeys.filter((key) => !(key in parsed));

  if (missingKeys.length > 0) {
    throw new Error('Invalid import file: missing required keys (goals, phases, tasks, todos)');
  }

  const { goals, phases, tasks, todos } = parsed;
  useTrackingStore.setState({ goals, phases, tasks, todos });
}
