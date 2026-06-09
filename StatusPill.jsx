import React from 'react';

export default function StatusPill({ status }) {
  const slug = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status ${slug}`}>{status}</span>;
}
