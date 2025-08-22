import React, { useEffect, useState } from "react";
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
import { baseurl } from "../helper/Helper"; // Adjust based on your setup

const { Option } = Select;

const statusOptions = [
  "Active",
  "Blocked",
  "Deleted",
  "Pause",
  "Pending",
  "Rejected",
];

const Affiliate = () => {
  const [form] = Form.useForm();
  const [affiliates, setAffiliates] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState(null);

  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/affiliates/getAllAffiliate`);
      console.log("data",res.data);
      setAffiliates(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load affiliates.");
    } finally {
      setLoading(false);
    }
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
    fetchAffiliates();
    fetchManagers();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingAffiliate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingAffiliate(record);
    form.setFieldsValue({
      firstname: record.firstname,
      lastName: record.lastName,
      affiliateName: record.affiliateName,
      email: record.email,
      status: record.status,
      postBackUrl: record.postBackUrl,
      manager: record.manager?._id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/affiliates/deleteAffiliate/${id}`);
      message.success("Affiliate deleted.");
      fetchAffiliates();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete affiliate.");
    }
  };

  const handleSubmit = async (values) => {
    try {
         
    //    const payload = {
    //   firstname: values.firstname,
    //   status: values.status,
    //   lastName: values.lastName,
    //   email: values.email,
    //   affiliateName: values.affiliateName,
    //   manager: values.manager || null,
    // };


      if (editingAffiliate) {
        await axios.put(
          `${baseurl}/api/affiliates/updateAffiliate/${editingAffiliate._id}`,
          values
        );
        message.success("Affiliate updated.");
      } else {
        await axios.post(`${baseurl}/api/affiliates/affiliateRegister`, values);
        message.success("Affiliate created.");
      }
      setIsModalOpen(false);
      fetchAffiliates();
    } catch (err) {
      console.error(err);
      message.error("Error saving affiliate.");
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Affiliate Name",
      dataIndex: "affiliateName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
   
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Manager",
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
      render: (_, record) => (
        <Popconfirm
          title="Delete this affiliate?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="link">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Create Affiliate
      </Button>

      <Table
        columns={columns}
        dataSource={affiliates}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingAffiliate ? "Edit Affiliate" : "Create Affiliate"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="affiliateName"
            label="Affiliate Name"
            rules={[{ required: true, message: "Please enter affiliate name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="postBackUrl"
            label="PostBack url"
            // rules={[{ required: true, message: "Please enter affiliate name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input type="email" />
          </Form.Item>

          {!editingAffiliate && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          

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
              {editingAffiliate ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Affiliate;
