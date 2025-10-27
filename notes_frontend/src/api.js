const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
export async function getNotes() {
  /** Fetch all notes */
  const res = await fetch(`${BASE_URL}/notes`, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    throw new Error(`Failed to fetch notes: ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Fetch a single note by id */
  const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(id)}`, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    throw new Error(`Failed to fetch note: ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a new note. payload: { title: string, content?: string } */
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(text || `Failed to create note: ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update an existing note by id. payload: { title?: string, content?: string } */
  const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(text || `Failed to update note: ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id */
  const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(text || `Failed to delete note: ${res.status}`);
  }
  return true;
}

async function safeText(res) {
  try {
    const text = await res.text();
    return text;
  } catch {
    return '';
  }
}

export default {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
