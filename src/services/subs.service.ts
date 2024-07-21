import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma.service"
import { Subscription, Prisma } from "@prisma/client"

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async isExistSubscription(where: Prisma.SubscriptionWhereUniqueInput): Promise<boolean> {
        const subscription = await this.prisma.subscription.findUnique({
            where
        })
        return subscription !== null
    }

    async getSubscription(where: Prisma.SubscriptionWhereUniqueInput): Promise<Subscription | null> {
        return this.prisma.subscription.findUnique({ where })
    }

    async createSubscription(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
        // 既に同一のユーザーが同一のフィードを購読している場合はエラー
        const user = data.user.connect
        if (!user) {
            throw new Error("User is not connected")
        }

        const feed = data.feed.connect
        if (!feed) {
            throw new Error("Feed is not connected")
        }

        const isExist = await this.prisma.subscription.findMany({
            where: {
                userId: user.id,
                feedId: feed.id
            }
        })

        if (isExist.length > 0) {
            throw new Error("Already subscribed")
        }

        return this.prisma.subscription.create({ data })
    }

    async updateSubscription(where: Prisma.SubscriptionWhereUniqueInput, data: Prisma.SubscriptionUpdateInput): Promise<Subscription> {
        return this.prisma.subscription.update({ where, data })
    }
}
