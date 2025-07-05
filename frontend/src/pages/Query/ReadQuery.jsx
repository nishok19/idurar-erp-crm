import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Spin, message } from 'antd';
import Notes from '@/components/Notes/Notes';
import { request } from '@/request';

export default function ReadQuery() {
  const { id } = useParams();
  const [query, setQuery] = useState();
  const [loading, setLoading] = useState(true);

  const fetchQuery = async () => {
    setLoading(true);
    try {
      const res = await request.get({ entity: `/queries/${id}` });
      setQuery(res);
    } catch (e) {
      message.error('Failed to fetch query');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuery();

    // eslint-disable-next-line
  }, [id]);

  const handleAddNote = async (text) => {
    try {
      await request.post({ entity: `/queries/${id}/notes`, jsonData: { note: text } });
      fetchQuery();
    } catch (e) {
      message.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await request.delete({ entity: `/queries/${id}/notes`, id: noteId });
      fetchQuery();
    } catch (e) {
      message.error('Failed to delete note');
    }
  };

  if (loading || !query) return <Spin />;

  return (
    <div>
      <Descriptions title="Query Details" bordered column={1}>
        <Descriptions.Item label="Customer">{query?.client}</Descriptions.Item>
        <Descriptions.Item label="Description">{query?.description}</Descriptions.Item>
        <Descriptions.Item label="Status">{query?.status}</Descriptions.Item>
        <Descriptions.Item label="Resolution">{query?.resolution}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(query?.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 24 }}>
        <Notes
          notes={query?.notes || []}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </div>
  );
}
