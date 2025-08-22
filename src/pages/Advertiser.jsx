import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import { baseurl } from "../helper/Helper";


const { Option } = Select;

const Advertiser = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvertiser, setEditingAdvertiser] = useState(null);


  const statusOptions = ['Active', 'Blocked', 'Deleted', 'Pause', 'Pending', 'Rejected'];

  const fetchAdvertisers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/advertisers/getAll`);

      console.log("data---",res.data.data)
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load advertisers.");
    }
    setLoading(false);
  };

  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/users/getAllUser`);
      setManagers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdvertisers();
    fetchManagers();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingAdvertiser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingAdvertiser(record);
    form.setFieldsValue({
      name: record.name,
      status: record.status,
      manager: record.manager?._id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/advertisers/delete/${id}`);
      message.success("Advertiser deleted.");
      fetchAdvertisers();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete advertiser.");
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      status: values.status,
      manager: values.manager || null,
    };

    try {
      if (editingAdvertiser) {
        await axios.put(
          `${baseurl}/api/advertisers/update/${editingAdvertiser._id}`,
          payload
        );
        message.success("Advertiser updated.");
      } else {
        await axios.post(`${baseurl}/api/advertisers/create`, payload);
        message.success("Advertiser created.");
      }
      setIsModalOpen(false);
      fetchAdvertisers();
    } catch (err) {
      console.error(err);
      message.error("Error saving advertiser.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Manager",
      dataIndex: ["manager", "name"],
      render: (_, record) => record.manager?.name || "N/A",
    },


    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
        </>
      ),
    },
    {
      title: "Delete",
      render: (_, record) =>
       
          <Popconfirm
            title="Delete this advertiser?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Create Advertiser
      </Button>

      <Table columns={columns} 
      dataSource={data} 
      loading={loading} 
      rowKey="_id" />

      <Modal
        title={editingAdvertiser ? "Edit Advertiser" : "Create Advertiser"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Advertiser Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter advertiser name" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              {statusOptions.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="manager" label="Manager">
            <Select placeholder="Select manager (optional)" allowClear>
              {managers.map((mgr) => (
                <Option key={mgr._id} value={mgr._id}>
                  {mgr.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingAdvertiser ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Advertiser;
