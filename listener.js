import SquawkSDK, { ListenerCallback, SquawkJS, TransportConfig } from '@benzinga/benzinga-squawk-sdk'

class BenzingaListenerIntegration {
    constructor(){
        this._transportConfig = {
            maxRetry: 10000,
            serverAddress: 'wss://squawk-lb.zingbot.bz/ws/v4/squawk',
        }
        this._client = undefined
    }

    async initializeSDK(apiKeyType, key, callback) {
        let builder = new SquawkSDK.Builder(this._transportConfig, callback)
        if (apiKeyType === 'api-key') builder = builder.withApiKey()
        else if (apiKeyType === 'token') builder = builder.withJWT()
        else {
            // default is session based
            builder = builder.withSession()
        }
        // debug is on
        this._client = builder.asListener().build()
        return this._client.initialize(key)
    }

    async startListening(channelId, element, pcWrapper) {
        return this._client.subscribeChannel(channelId, element, pcWrapper)
    }

    async stopListening(channelId) {
        return this._client.unsubscribeChannel(channelId)
    }

    async getAvailableStreams() {
        return this._client.getAvailableChannels()
    }

    toggleAudio(channelId, makeMute) {
        if (makeMute) this._client.muteChannel(channelId)
        else this._client.unMuteChannel(channelId)
    }

    async dispose() {
        try {
            await this._client?.stop()
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(e)
        } finally {
            this._client = undefined
        }
    }
}

export { BenzingaListenerIntegration }
