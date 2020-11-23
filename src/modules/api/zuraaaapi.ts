import Axios, { AxiosInstance } from 'axios'
import { Bot, CountBot, DeleteBot } from './entitys/bot'
import { User } from './entitys/user'
import { api } from '../../../config.json'
import { Auth } from './entitys/auth'

class ZuraaaApi {
    private readonly api: AxiosInstance

    constructor(){
        this.api = Axios.create({
            baseURL: api.zuraaa.url,
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    async getBot(id: string): Promise<Bot>{
        return (await this.api.get('bots/' + id)).data
    }

    async getUserBots (id: string): Promise<Bot[]>{
        return (await this.api.get('users/' + id + '/bots')).data
    }

    async getUser(id: string): Promise<User>{
        return (await this.api.get('users/' + id)).data
    }

    private async getUserToken(id: string): Promise<Auth>{
        return (await this.api.post('/auth/user', {
            type: 'bot',
            identify: api.zuraaa.secret,
            data: id
        })).data
    }

    async removeBot(botId: string, requestId: string): Promise<DeleteBot>{
        return (await this.api.delete('/bots/' + botId, {
            headers: {
                'Authorization': 'Bearer ' + (await this.getUserToken(requestId)).access_token
            }
        })).data
    }

    async resetVotes(requestId: string) {
        const token = (await this.getUserToken(requestId)).access_token;
        console.log(token);
        const result = await this.api.put("/bots?type=resetVotes", null, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return result.status == 200;
    }

    async getBotCount(): Promise<CountBot>{
        return (await this.api.get('/bots?type=count')).data
    }
}

export default ZuraaaApi