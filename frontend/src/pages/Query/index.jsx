import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import DataTable from '@/components/DataTable/DataTable';
import CrudModal from '@/components/CrudModal';
import QueryForm from '@/forms/QueryForm';
import useLanguage from '@/locale/useLanguage';
import { Select, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { DefaultLayout } from '@/layout';
import { request } from '@/request';
import DeleteModal from '@/components/CrudModal';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export default function QueryListPage() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Fetch queries and clients
  const { result: queryResult } = useSelector(
    (state) => state.crud.queries || { result: { items: [], pagination: {} } }
  );
  const { result: clientResult } = useSelector(
    (state) => state.crud.list || { result: { items: [] } }
  );

  // Fetch on mount
  React.useEffect(() => {
    dispatch(crud.list({ entity: 'queries' }));
    dispatch(crud.list({ entity: 'client' }));
  }, [dispatch]);

  // Filtered data
  const filteredItems = useMemo(() => {
    if (!statusFilter) return queryResult.items;
    return queryResult.items.filter((q) => q.status === statusFilter);
  }, [queryResult.items, statusFilter]);

  // Custom fetch for queries
  const fetchQueries = async (options = {}) => {
    const params = new URLSearchParams(options).toString();
    const res = await request.get({ entity: `/queries${params ? '?' + params : ''}` });
    console.log('in query compo ', res);
    return res.data || res;
  };

  // // Custom edit handler for queries
  // const handleEditQuery = (record) => {
  //   setCurrentEditItem(record);
  //   setIsEditModalOpen(true);
  // };

  // DataTable columns
  const columns = [
    {
      title: translate('Customer Name'),
      dataIndex: 'client',
      key: 'client',
      render: (_, record) => {
        const client = clientResult.items.find((c) => c._id === record.client);
        return client ? client.name : '-';
      },
    },
    {
      title: translate('Description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: translate('Created Date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      key: 'status',
      filters: STATUS_OPTIONS.map((s) => ({ text: s.label, value: s.value })),
      onFilter: (value, record) => record.status === value,
      render: (status) => STATUS_OPTIONS.find((s) => s.value === status)?.label || status,
    },
    {
      title: translate('Resolution'),
      dataIndex: 'resolution',
      key: 'resolution',
      render: (text) => (text && text.length > 30 ? text.slice(0, 30) + '...' : text),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          allowClear
          placeholder={translate('Status')}
          style={{ width: 200 }}
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        {/* Add Query Button handled by DataTable/CrudModal context */}
      </div>
      <DataTable
        config={{
          entity: 'queries',
          dataTableColumns: columns,
          DATATABLE_TITLE: translate('Query List'),
          customListRequest: fetchQueries,
          ADD_NEW_ENTITY: translate('add_new_query'),
          navigateTo: '/query/create',
        }}
      />
      {/* <CrudModal
        config={{
          entity: 'queries',
          modalTitle: translate('Edit Query'),
          open: isEditModalOpen,
          onCancel: () => {
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          },
          onOk: () => {
            // Handle form submission
            setIsEditModalOpen(false);
            setCurrentEditItem(null);
          },
        }}
      >
        <QueryForm initialValues={currentEditItem} />
      </CrudModal> */}
      <DeleteModal
        config={{
          entity: 'queries',
          deleteModalLabels: ['description'],
          modalTitle: translate('Delete Query'),
          deleteMessage: translate('Are you sure you want to delete this query?'),
        }}
      />
    </DefaultLayout>
  );
}
