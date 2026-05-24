import React, { useState, useRef } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { GoalRow } from '@/components/progress';
import useTrackingStore from '@/store/useTrackingStore';
import useProgressStore from '@/store/useProgressStore';
import { calcGoalProgress } from '@/utils/progressCalc';
import { exportData, importData } from '@/utils/exportImport';

// ─── MetricCard ────────────────────────────────────────────────────────────────

function MetricCard({ label, value }) {
  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'var(--color-text-muted)',
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Filter pill labels ────────────────────────────────────────────────────────

const FILTER_PILLS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'paused', label: 'Paused' },
];

const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'deadline', label: 'Deadline (soonest)' },
  { value: 'progress', label: 'Progress (highest)' },
  { value: 'created', label: 'Created (newest)' },
];

// ─── ProgressPage ──────────────────────────────────────────────────────────────

export default function ProgressPage() {
  // Filter / sort / search state
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion state
  const [expandedGoalId, setExpandedGoalId] = useState(null);

  // Import modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pendingImportJson, setPendingImportJson] = useState(null);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  // Store data
  const { goals, phases } = useTrackingStore();
  const { getMetrics, getGoalProgress } = useProgressStore();
  const metrics = getMetrics();

  // ── Build goal list ──────────────────────────────────────────────────────────

  let goalList = Object.values(goals);

  // Filter by status pill
  if (activeFilter !== 'all') {
    goalList = goalList.filter((g) => g.status === activeFilter);
  }

  // Filter by search query (case-insensitive title match)
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    goalList = goalList.filter((g) => g.title.toLowerCase().includes(q));
  }

  // Sort
  goalList = [...goalList].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'deadline') {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    }
    if (sortBy === 'progress') {
      const pa = getGoalProgress(a.id);
      const pb = getGoalProgress(b.id);
      return pb - pa;
    }
    if (sortBy === 'created') {
      const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return cb - ca;
    }
    return 0;
  });

  // ── Accordion toggle ─────────────────────────────────────────────────────────

  function handleToggle(goalId) {
    setExpandedGoalId((prev) => (prev === goalId ? null : goalId));
  }

  // ── Import handlers ──────────────────────────────────────────────────────────

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingImportJson(ev.target.result);
      setImportError('');
      setImportModalOpen(true);
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  function handleConfirmImport() {
    try {
      importData(pendingImportJson);
      setImportModalOpen(false);
      setPendingImportJson(null);
    } catch (err) {
      setImportError(err.message ?? 'Import failed.');
    }
  }

  function handleCancelImport() {
    setImportModalOpen(false);
    setPendingImportJson(null);
    setImportError('');
  }

  // ── Styles ───────────────────────────────────────────────────────────────────

  const pageStyle = {
    padding: '32px',
    maxWidth: '900px',
    margin: '0 auto',
    minHeight: '100vh',
  };

  const headerRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  };

  const titleStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    color: 'var(--color-text-primary)',
    margin: 0,
    fontWeight: 700,
  };

  const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    margin: '24px 0',
  };

  const filterBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  };

  const pillsStyle = {
    display: 'flex',
    gap: '6px',
  };

  const selectStyle = {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <div style={pageStyle}>
      {/* Page header */}
      <div style={headerRowStyle}>
        <h1 style={titleStyle}>Progress</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={exportData}>
            Export Data
          </Button>
          <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
            Import Data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Metric cards */}
      <div style={metricsGridStyle}>
        <MetricCard label="Total Goals" value={metrics.totalGoals} />
        <MetricCard label="Actively Working" value={metrics.activelyWorking} />
        <MetricCard label="Completed This Month" value={metrics.completedThisMonth} />
        <MetricCard label="Overdue Tasks" value={metrics.overdueTasks} />
      </div>

      {/* Filter bar */}
      <div style={filterBarStyle}>
        {/* Status pills */}
        <div style={pillsStyle}>
          {FILTER_PILLS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                  background: isActive ? 'var(--color-accent-primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
          aria-label="Sort goals"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Search input */}
        <div style={{ flex: 1, minWidth: '160px' }}>
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search goals"
          />
        </div>
      </div>

      {/* Goal rows */}
      <div>
        {goalList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 0',
              color: 'var(--color-text-muted)',
              fontSize: '14px',
            }}
          >
            No goals match your filters.
          </div>
        ) : (
          goalList.map((goal) => {
            const goalPhases = (goal.phaseIds ?? [])
              .map((pid) => phases[pid])
              .filter(Boolean);
            const progress = calcGoalProgress(goalPhases);

            return (
              <GoalRow
                key={goal.id}
                goal={goal}
                phases={goalPhases}
                progress={progress}
                isExpanded={expandedGoalId === goal.id}
                onToggle={handleToggle}
              />
            );
          })
        )}
      </div>

      {/* Import confirmation modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={handleCancelImport}
        title="Import Data"
      >
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          This will replace all current data with the imported file. This action cannot be undone.
          Are you sure you want to continue?
        </p>
        {importError && (
          <p style={{ color: 'var(--color-accent-coral)', fontSize: '13px', marginBottom: '12px' }}>
            {importError}
          </p>
        )}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={handleCancelImport}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmImport}>
            Confirm Import
          </Button>
        </div>
      </Modal>
    </div>
  );
}
