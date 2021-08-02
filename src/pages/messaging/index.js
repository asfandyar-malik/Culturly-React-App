import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { SendOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { Avatar, Col, Divider, Empty, Form, Input, Row, Space } from "antd";

import { isEmpty } from "_dash";
import { groupByDate } from "utils";
import { getChannels, getChannelMessages, sendChannelMessage } from "actions";

import noMessageImg from "assets/images/noMessage.svg";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "Today",
    d: "Yesterday",
    dd: "%d days ago",
    M: "a month ago",
    MM: "%d months ago",
    y: "a year",
    yy: "%d years",
  },
});

const Messaging = () => {
  const [form] = Form.useForm();
  const messaageElRef = useRef(null);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState({});
  const [channelMessages, setChannelMessages] = useState({});

  const sortChannelMessageGroup = Object.keys(channelMessages).sort();

  useEffect(() => {
    getChannels().then((response) => {
      setChannels(response.data);
    });
  }, []);

  function scrollToBottom() {
    const currentEl = messaageElRef.current;
    if (currentEl) {
      currentEl.scroll({ top: currentEl.scrollHeight });
    }
  }

  function updateMessages(messages) {
    const nestedArrays = Object.values(channelMessages);
    const allMessages = [].concat.apply([], nestedArrays);
    const newMessages = messages.filter(
      (o) => !allMessages.some((i) => i.message_id === o.message_id)
    );
    setChannelMessages(groupByDate([...allMessages, ...newMessages]));
  }

  function getMessages(page, firstLoad = true) {
    if ((hasMore || page === 1) && !loading) {
      setLoading(true);
      getChannelMessages(
        page,
        selectedChannel.channel_id,
        selectedChannel.host.id
      ).then((response) => {
        const { results } = response.data;
        setLoading(false);
        setCurrentPage(page);
        if (hasMore) {
          setHasMore(!!response.data.next);
        }
        updateMessages(results);
        if (firstLoad && page === 1) {
          scrollToBottom();
        }
      });
    }
  }

  useEffect(() => {
    if (!isEmpty(selectedChannel)) {
      getMessages(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  function onScroll(scrollPosition) {
    if (scrollPosition < 40 && !loading) {
      setLoading(true);
      getMessages(currentPage + 1, false);
    }
  }

  function onFormSubmit(payload) {
    sendChannelMessage(
      selectedChannel.channel_id,
      selectedChannel.host.id,
      payload
    ).then((response) => {
      updateMessages([response.data]);
      form.resetFields();
      scrollToBottom();
    });
  }

  return (
    <Row className="inbox-container">
      <Col span={8}>
        <div className="header">
          <div>
            <p className="text-3xl bold">Inbox</p>
          </div>
        </div>
        <div className="users-list">
          {channels.map((channel) => {
            const { host } = channel;
            return (
              <div
                key={host.id}
                onClick={() => setSelectedChannel(channel)}
                className={`user-item ${
                  host.id === selectedChannel.host?.id ? "selected" : ""
                }`}
              >
                <Space>
                  <Avatar src={host.profile.profile_pic_url} />
                  <div>
                    <p className="text-xl bold">{`${host.first_name} ${host.last_name}`}</p>
                    <p className="text-base secondary recent-message">
                      {channel.recent_message?.content}
                    </p>
                  </div>
                </Space>
              </div>
            );
          })}
        </div>
      </Col>
      <Col span={16} className="message-create-col">
        <Choose>
          <When condition={isEmpty(selectedChannel)}>
            <Empty
              image={noMessageImg}
              description={
                <span className="text-3xl bold">
                  Empty state on no user selection
                </span>
              }
            />
          </When>
          <Otherwise>
            <div className="header">
              <Space>
                <Avatar src={selectedChannel.host?.profile?.profile_pic_url} />
                <p className="text-2xl medium">{`${selectedChannel.host?.first_name} ${selectedChannel.host?.last_name}`}</p>
              </Space>
            </div>
            <div
              ref={messaageElRef}
              className="message-items-wrapper"
              onScroll={(e) => onScroll(e.target.scrollTop)}
            >
              {sortChannelMessageGroup.map((dateKey) => {
                const dateMessages = [...channelMessages[dateKey]].sort(
                  (a, b) => a.ts - b.ts
                );
                return (
                  <div key={dateKey}>
                    <Divider>{dayjs(dateKey).fromNow(true)}</Divider>
                    {dateMessages.map((item) => {
                      return (
                        <div key={item.message_id}>
                          <div
                            className={`message-item ${
                              item.is_self_message ? "self-message" : ""
                            }`}
                          >
                            <p>{item.content}</p>
                            <p className="time">
                              {dayjs.unix(item.ts).format("h:mm A")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="message-form">
              <Form onFinish={(values) => onFormSubmit(values)} form={form}>
                <Form.Item name="content">
                  <Input.TextArea
                    rows={2}
                    bordered={false}
                    placeholder="Write your message"
                  />
                </Form.Item>
                <Form.Item>
                  <SendOutlined onClick={() => form.submit()} />
                </Form.Item>
              </Form>
            </div>
          </Otherwise>
        </Choose>
      </Col>
    </Row>
  );
};

export default Messaging;
