import React, { useState } from 'react';
import { List, Input, Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function Notes({ notes = [], onAddNote, onDeleteNote }) {
  const [noteText, setNoteText] = useState('');

  const handleAdd = () => {
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
    }
  };

  return (
    <div>
      <List
        header={<b>Notes</b>}
        dataSource={notes}
        renderItem={(note) => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => onDeleteNote(note.noteId)}
                key="delete"
              />,
            ]}
          >
            <Space direction="vertical">
              <span>{note.text}</span>
              <small>{new Date(note.timestamp).toLocaleString()}</small>
            </Space>
          </List.Item>
        )}
      />
      <Space style={{ marginTop: 8 }}>
        <Input.TextArea
          rows={2}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a note..."
        />
        <Button type="primary" onClick={handleAdd}>
          Add
        </Button>
      </Space>
    </div>
  );
}
