import { Modal, Button, Form, Row, Col, Input, message } from "antd";
import { useState, forwardRef, useImperativeHandle } from "react";
import { timeBasedUUID } from "../../utils";
import useIndexedDB from "../../hooks/useIndexedDB";

const AddEditForm = forwardRef((props, ref) => {
  const [modal2Open, setModal2Open] = useState(false);
  const { openLoading, addItem, getAllItems } = useIndexedDB("test", "test", 1);

  const [form] = Form.useForm();

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    openModal: () => setModal2Open(true),
    closeModal: () => setModal2Open(false),
  }));


  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const param = { id: timeBasedUUID(), ...values }
      await addItem(param);
      message.success("添加成功");
      setModal2Open(false)
    });
  }

  return (
    <div>
      <Modal
        title="添加用户"
        centered
        open={modal2Open}
        onOk={handleOk} // 点击确认关闭模态框
        onCancel={() => setModal2Open(false)} // 点击取消关闭模态框
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="用户名"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="account"
                label="账号"
                rules={[{ required: true, message: "请输入账号" }]}
              >
                <Input placeholder="请输入账号" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: "请输入手机号" }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="chinese"
                label="状态"
                rules={[{ required: true, message: "请输入状态" }]}
              >
                <Input placeholder="请输入状态" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
});

export default AddEditForm;