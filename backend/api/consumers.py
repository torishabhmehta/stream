from channels.generic.websocket import AsyncWebsocketConsumer 
import json

class PlayerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
            await self.channel_layer.group_add(
                "stream",
                self.channel_name
                )
            await self.accept()

    async def disconnect(self, close_code):
            await self.channel_layer.group_discard(
                "stream",
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        url = text_data_json['url']
        duration = text_data_json['duration']
        played = text_data_json['played']
        muted = text_data_json['muted']
        volume = text_data_json['volume']
        seeking = text_data_json['seeking']
        playing = text_data_json['playing']
        await self.channel_layer.group_send(
                "stream",
            {
            'type': 'web_stream',
            'url': url,
            'played': played,
            'muted': muted,
            'duration': duration,
            'volume': volume,
            'seeking': seeking,
            'playing': playing,
            }
        )

    async def web_stream(self, event):
        url = event['url']
        played = event['played']
        muted = event['muted']
        seeking = event['seeking']
        duration = event['duration']
        volume = event['volume']
        playing = event['playing']
        await self.send(text_data=json.dumps({
            'url': url,
            'played': played,
            'muted': muted,
            'duration': duration,
            'volume': volume,
            'seeking': seeking,
            'playing': playing,
        }))
