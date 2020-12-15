export interface Bot{
  _id: string
  username: string
  discriminator: string
  details: BotDetails
  owner: string
  approvedBy: string
  votes: BotVotes
}

export interface BotDetails {
  prefix: string
  library: string
  shortDescription: string
  tags: string[]
  otherOwners: string[]
}

export interface BotVotes{
  current: number
}

export interface DeleteBot{
  deleted: boolean
}

export interface CountBot{
  bots_count: string
}
