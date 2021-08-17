import { createContainer } from 'unstated-next';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';

function useContainer() {
  const [subscribeTopic, sendMessage] = useSendWebsocketMessage();

  return {
    subscribeTopic,
    sendMessage,
  };
}

const Container = createContainer<ReturnType<typeof useContainer>, any>(useContainer);

export { useContainer };

export default Container;
