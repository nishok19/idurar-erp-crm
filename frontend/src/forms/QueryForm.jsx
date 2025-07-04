import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import useLanguage from '@/locale/useLanguage';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export default function QueryForm({ initialValues = {}, onFinish: onFinishProp }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const translate = useLanguage();
  // const { result: clientResult } = useSelector(
  //   (state) => state.crud?.result || { result: { items: [] } }
  // );
  const clientResult = useSelector((state) => state.crud.list.result);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(crud.list({ entity: 'client' }));
  }, [dispatch]);

  const onFinish = async (values) => {
    console.log('form values...', values);
    setLoading(true);
    if (onFinishProp) {
      await onFinishProp(values);
    } else {
      await dispatch(crud.create({ entity: 'queries', jsonData: values }));
    }
    setLoading(false);
    form.resetFields();
  };
  // const onFinish = async (values) => {
  //   setLoading(true);
  //   if (onFinishProp) {
  //     await onFinishProp(values);
  //   } else {
  //     if (initialValues && initialValues._id) {
  //       await dispatch(crud.update({ entity: 'queries', id: initialValues._id, values }));
  //     } else {
  //       await dispatch(crud.create({ entity: 'queries', values }));
  //     }
  //   }
  //   setLoading(false);
  //   form.resetFields();
  // };

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item
        name="client"
        label={translate('Customer Name')}
        rules={[{ required: true, message: translate('Please select a customer') }]}
      >
        <Select
          showSearch
          placeholder={translate('Select a customer')}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {clientResult.items.map((client) => (
            <Select.Option key={client._id} value={client._id}>
              {client.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="description"
        label={translate('Description')}
        rules={[{ required: true, message: translate('Please enter a description') }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="status"
        label={translate('Status')}
        rules={[{ required: true, message: translate('Please select a status') }]}
      >
        <Select options={STATUS_OPTIONS} />
      </Form.Item>
      <Form.Item name="resolution" label={translate('Resolution')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {translate('Submit')}
        </Button>
      </Form.Item>
    </Form>
  );
}
