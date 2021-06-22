import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tag,
  Modal,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import { getEventCover } from "utils";
import { EVENTS_ROUTE } from "routes";
import { getEventDetail, getTimezones, registerForEvent } from "actions";

const EventDetail = () => {
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const { eventSlug } = params;

  const [timezones, setTimezones] = useState([]);
  const [eventDetail, setEventDetail] = useState({});
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [eventMediaImg, setEventMediaImg] = useState("");
  const [alternateItems, setAlternateItems] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);

  const { pricing = {} } = eventDetail;
  const minimumGuests = eventDetail.minimum_guests;
  const maximumGuests = eventDetail.maximum_guests;

  function getEstimatedCost(pricing, participants = 0) {
    let cost = 0;
    if (pricing.flat_price) {
      cost = pricing.flat_price;
    }
    if (pricing.price_per_person) {
      cost = pricing.price_per_person * participants;
    }
    setEstimatedCost(cost);
  }

  useEffect(() => {
    if (eventSlug) {
      getEventDetail(eventSlug).then((response) => {
        const { data } = response;
        setEventDetail(data);
        getEstimatedCost(data.pricing, data.minimum_guests);
        form.setFieldsValue({ participants_count: data.minimum_guests });
      });
      getTimezones().then((response) => {
        setTimezones(response.data);
      });
    }
  }, [eventSlug]);

  function removeAlternateItem(index) {
    alternateItems.splice(index, 1);
    setAlternateItems([...alternateItems]);
  }

  function handleOnPreview(imageUrl) {
    setEventMediaImg(imageUrl);
    setMediaModalVisible(true);
  }

  function onSubmit(values) {
    const alternateDates = [];
    (values.alternate_dates || []).forEach((item) => {
      alternateDates.push({
        alternate_date: item.format("YYYY-MM-DDTHH:mm"),
      });
    });
    values.alternate_dates = alternateDates;
    values.preferred_date = values.preferred_date.format("YYYY-MM-DDTHH:mm");
    registerForEvent(eventSlug, values);
  }

  const validateParticipants = (_, value) => {
    if (value < minimumGuests) {
      return Promise.reject(
        new Error(`Minimum guests should be ${minimumGuests}`)
      );
    } else if (value > maximumGuests) {
      return Promise.reject(
        new Error(`Maximum guests should be less than ${maximumGuests}`)
      );
    }
    return Promise.resolve();
  };

  return (
    <>
      <div className="event-detail">
        <div
          className="banner"
          style={{ backgroundImage: `url(${getEventCover(eventDetail)})` }}
        >
          <div className="banner-detail">
            <p
              className="mb-12 text-2xl semi-bold"
              onClick={() => history.push(EVENTS_ROUTE)}
            >
              <ArrowLeftOutlined />
              <span>All events</span>
            </p>
            <Space>
              {(eventDetail.pictures || []).map((item) => {
                return (
                  <img
                    key={item.id}
                    alt="event-pictures"
                    src={item.picture_url}
                    onClick={() => handleOnPreview(item.picture_url)}
                  />
                );
              })}
            </Space>
          </div>
        </div>
        <Row gutter={42}>
          <Col span={16}>
            <p className="text-4xl bold">{eventDetail.title}</p>
            <div className="mt-8">
              <Space size={24}>
                <Tag color="#87d068">{(eventDetail.category || {}).name}</Tag>
                <Space size={8}>
                  <ClockCircleOutlined />
                  <p>{eventDetail.duration * 60} min</p>
                </Space>
                <Space size={8}>
                  <FieldTimeOutlined />
                  <p>{eventDetail.timezone}</p>
                </Space>
                <Space size={8}>
                  <UserOutlined />
                  <p>Min {minimumGuests} people</p>
                </Space>
                <Space size={8}>
                  <TeamOutlined />
                  <p>Max {eventDetail.maximum_guests} people</p>
                </Space>
                <Space size={8}>
                  <NotificationOutlined />
                  <p>{eventDetail.language}</p>
                </Space>
              </Space>
            </div>
            <div className="mt-20">
              <p className="text-2xl">
                {(eventDetail.detail || {}).description}
              </p>
              <div className="mt-24">
                <p className="text-3xl bold mb-4">What's included</p>
                <p className="text-2xl">
                  {(eventDetail.detail || {}).extra_information}
                </p>
              </div>
              <div className="mt-24">
                <p className="text-3xl bold mb-4">What's itinerary</p>
                <p className="text-2xl">
                  {(eventDetail.detail || {}).itinerary}
                </p>
              </div>
              <div className="mt-24">
                <p className="text-3xl bold mb-4">What you'll need</p>
                <p className="text-2xl">
                  {(eventDetail.detail || {}).participant_information}
                </p>
              </div>
              <div className="mt-24">
                <p className="text-3xl bold mb-4">
                  Get to know your service provider
                </p>
                <div className="provider">
                  <Space size={12}>
                    <Avatar size={52} />
                    <div>
                      <p className="text-base">Provided by</p>
                      <p className="text-2xl bold">Tap Trailer Co.</p>
                    </div>
                  </Space>
                  <Button type="ghost" size="large">
                    Contact provider
                  </Button>
                </div>
              </div>
              <p className="mt-36 text-xl">Need help? Visit our Help center</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="event-register">
              <Space className="w-full justify-space-between">
                <p className="text-3xl medium">
                  <If condition={pricing.flat_price}>
                    ${pricing.flat_price} flat fee
                  </If>
                  <If condition={pricing.price_per_person}>
                    ${pricing.price_per_person} per person
                  </If>
                </p>
              </Space>
              <Form
                form={form}
                layout="vertical"
                className="mt-12"
                requiredMark={false}
                onFinish={(values) => onSubmit({ ...values })}
              >
                <Form.Item
                  name="preferred_date"
                  label="Provide a date and start time"
                  rules={[
                    {
                      required: true,
                      message: "Primary date is required",
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    className="w-full"
                    allowClear={false}
                    showSecond={false}
                    format="YYYY-MM-DD hh:mm"
                  />
                </Form.Item>
                <If condition={alternateItems.length}>
                  <p className="text-xl semi-bold mb-12">Alternative times</p>
                  {alternateItems.map((item, index) => {
                    return (
                      <Space
                        size={12}
                        key={index}
                        align="start"
                        className="w-full alternate-date"
                      >
                        <Form.Item name={["alternate_dates", index]}>
                          <DatePicker
                            showTime
                            size="large"
                            allowClear={false}
                            showSecond={false}
                            className="w-full flex-1"
                            format="YYYY-MM-DD hh:mm"
                          />
                        </Form.Item>
                        <DeleteOutlined
                          onClick={() => removeAlternateItem(index)}
                        />
                      </Space>
                    );
                  })}
                </If>
                <If condition={alternateItems.length < 3}>
                  <Form.Item noStyle>
                    <p
                      className="alternate-action"
                      onClick={() =>
                        setAlternateItems([...alternateItems, { value: null }])
                      }
                    >
                      Add alternate date and time
                    </p>
                  </Form.Item>
                </If>
                <Form.Item
                  label="Confirm timezone"
                  name="timezone"
                  rules={[
                    {
                      required: true,
                      message: "Timezone is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    size="large"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {timezones.map((item) => {
                      return (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item noStyle>
                  <p className="text-2xl medium mb-16">Additional details</p>
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Number of participants required",
                    },
                    {
                      validator: validateParticipants,
                    },
                  ]}
                  name="participants_count"
                  label="Number of participants"
                  extra={`Minimum participants ${minimumGuests}`}
                >
                  <InputNumber
                    size="large"
                    type="number"
                    className="w-full"
                    min={minimumGuests}
                    max={maximumGuests}
                    onChange={(value) =>
                      getEstimatedCost(eventDetail.pricing, value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Additional comments" name="comments">
                  <Input.TextArea rows={5} />
                </Form.Item>
                <Form.Item noStyle>
                  <Space className="w-full justify-space-between">
                    <div>
                      <p className="text-xl bold">Estimated total</p>
                      <p className="text-xl secondary">
                        Not including taxes and fees
                      </p>
                    </div>
                    <p className="text-2xl bold">US${estimatedCost}</p>
                  </Space>
                </Form.Item>
                <Form.Item noStyle>
                  <Button
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="mt-20"
                  >
                    Submit request
                  </Button>
                  <p className="text-xl secondary mt-8 text-center">
                    You won't be charged yet
                  </p>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        footer={null}
        closable={false}
        visible={mediaModalVisible}
        className="event-media-modal"
        onCancel={() => setMediaModalVisible(false)}
      >
        <img alt="event-media" src={eventMediaImg} />
      </Modal>
    </>
  );
};

export default EventDetail;
