import Axios, { AxiosInstance } from 'axios'
import { Bot, CountBot, DeleteBot } from './entitys/bot'
import { User } from './entitys/user'
import { api } from '@/config.json'
import { Auth } from './entitys/auth'

class ZuraaaApi {
  private readonly api: AxiosInstance

  constructor () {
    this.api = Axios.create({
      baseURL: api.zuraaa.url,
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  async getBot (id: string): Promise<Bot | undefined> {
    try {
      return (await this.api.get('bots/' + id)).data
    } catch {
      return undefined
    }
  }

  async getTopBots (): Promise<Bot[]> {
    return (await this.api.get('bots?type=top&limit=6')).data
  }

  async getUserBots (id: string): Promise<Bot[]> {
    return (await this.api.get('users/' + id + '/bots')).data
  }

  async getUser (id: string): Promise<User> {
    return (await this.api.get('users/' + id)).data
  }

  private async getUserToken (id: string): Promise<Auth> {
    return (await this.api.post('/auth/user', {
      type: 'bot',
      identify: api.zuraaa.secret,
      data: id
    })).data
  }

  async removeBot (botId: string, requestId: string, reason: string | null): Promise<DeleteBot> {
    const auth = await this.getUserToken(requestId)

    const bot = await this.getBot(botId)

    if (bot == null) {
      return {
        deleted: false
      }
    }

    let data: DeleteBot

    if (bot.owner === requestId) {
      const result = await this.api.delete('/bots/' + botId, {
        headers: {
          Authorization: 'Bearer ' + auth.access_token
        }
      })
      data = result.data
    } else {
      const result = await this.api.post('/bots/' + botId + '/reason-remove', {
        reason: reason
      }, {
        headers: {
          Authorization: 'Bearer ' + auth.access_token
        }
      })
      data = result.data
    }

    return data
  }

  async resetVotes (requestId: string): Promise<boolean> {
    const token = (await this.getUserToken(requestId)).access_token
    const result = await this.api.patch('/bots?type=resetVotes', null, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    return result.status === 200
  }

  async getBotCount (): Promise<CountBot> {
    return (await this.api.get('/bots?type=count')).data
  }
}

export default ZuraaaApi
