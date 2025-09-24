import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import { baseurl } from "../helper/Helper";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Offer = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompaign, setEditingCompaign] = useState(null);

  const statusOptions = ['Active', 'Blocked', 'Deleted', 'Pause', 'Pending', 'Rejected'];
  const deviceOptions = ['cctv', 'mobile', 'tablet', 'desktop'];
  const typeOptions = ['web', 'app', 'apk'];

  const fetchCompaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseurl}/api/compaigns/getALLCompaign`);
      // console.log(res.data)
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load campaigns.");
    }
    setLoading(false);
  };

  const fetchAdvertisers = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/advertisers/getAll`);
      setAdvertisers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompaigns();
    fetchAdvertisers();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingCompaign(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCompaign(record);
    form.setFieldsValue({
      ...record,
      advertiser: record.advertiser?._id,
      dateRange: [moment(record.startDate), moment(record.endDate)],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/compaigns/deleteCompaign/${id}`);
      message.success("Campaign deleted.");
      fetchCompaigns();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete campaign.");
    }
  };

  const handleSubmit = async (values) => {
    const [startDate, endDate] = values.dateRange || [];

    const payload = {
      offerName: values.offerName,
      status: values.status,
      devices: values.devices,
      type: values.type,
      trakingUrl: values.trakingUrl,
      visibility: values.visibility,
      payout: values.payout,
      startDate,
      endDate,
      advertiser: values.advertiser || null,
    };

    try {
      if (editingCompaign) {
        await axios.patch(
          `${baseurl}/api/compaigns/updateCompaign/${editingCompaign._id}`,
          payload
        );
        message.success("Campaign updated.");
      } else {
        await axios.post(`${baseurl}/api/compaigns/creteCompaign`, payload);
        message.success("Campaign created.");
      }
      setIsModalOpen(false);
      fetchCompaigns();
    } catch (err) {
      console.error(err);
      message.error("Error saving campaign.");
    }
  };

  const columns = [
    { title: "CompId", dataIndex: "compId" },
    { title: "Offer Name", dataIndex: "offerName" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Devices",
      dataIndex: "devices",
      render: (devices) => devices?.join(", "),
    },
    { title: "Type", dataIndex: "type" },
    { title: "Tracking URL", dataIndex: "trakingUrl" },
    { title: "Payout", dataIndex: "payout" },
    {
      title: "Advertiser",
      render: (_, record) => record.advertiser?.name || "N/A",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
    {
      title: "Delete",
      render: (_, record) => (
        <Popconfirm
          title="Delete this campaign?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="link">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Create Campaign
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingCompaign ? "Edit Campaign" : "Create Campaign"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="offerName"
            label="Offer Name"
            rules={[{ required: true, message: "Enter offer name" }]}
          >
            <Input placeholder="Enter offer name" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Select status" }]}
          >
            <Select placeholder="Select status">
              {statusOptions.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="devices"
            label="Devices"
            rules={[{ required: true, message: "Select at least one device" }]}
          >
            <Select mode="multiple" placeholder="Select devices">
              {deviceOptions.map((device) => (
                <Option key={device} value={device}>
                  {device}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Select type" }]}
          >
            <Select placeholder="Select type">
              {typeOptions.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item
  name="visibility"
  label="Visibility"
  rules={[{ required: true, message: "Select visibility" }]}
>
  <Select placeholder="Select visibility">
    <Select.Option value="Public">Public</Select.Option>
    <Select.Option value="Private">Private</Select.Option>
  </Select>
</Form.Item>


          <Form.Item
            name="trakingUrl"
            label="Tracking URL"
            rules={[{ required: true, message: "Enter tracking URL" }]}
          >
            <Input placeholder="Enter tracking URL" />
          </Form.Item>

          <Form.Item name="payout" label="Payout">
            <Input placeholder="Enter payout (optional)" />
          </Form.Item>

          <Form.Item name="advertiser" label="Advertiser">
            <Select placeholder="Select advertiser (optional)" allowClear>
              {advertisers.map((adv) => (
                <Option key={adv._id} value={adv._id}>
                  {adv.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="dateRange" label="Start & End Date">
            <RangePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingCompaign ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Offer;
