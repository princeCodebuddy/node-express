import { prisma } from "../../../helper/prismaClient";
import { IOrderService } from "../../../interface/OrderInterface";
import { IResponse } from "../../../interface/responseHandler";

export default class OrderService implements IOrderService {
    async createOrder(body: any, file: any, user: any): Promise<IResponse> {
        try {
            if (file) {
                body.fileName = file.filename
            }
            body.userId = user.id;
            const orderInfo = await prisma.order.create({ data: body });
            if (!orderInfo) return { code: 400, message: 'Something went wrong', success: false }
            return { code: 201, message: "Order placed", success: true, data: orderInfo }

        } catch (err) {
            throw err;
        }
    }
    async orderList(body: any): Promise<IResponse> {
        try {
            const { page, pageSize, search, sortField, sortOrder, status } = body;
            const skip: number = (page - 1) * pageSize;
            let and_clause = [];
            let conditions = {} as any;
            if (search && search != '') {
                and_clause.push({
                    $or: [
                        {
                            jobLink: {
                                $regex: search.replace(/[!@#$%^&*?/<>]/g).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim(),
                                $options: 'i'
                            }
                        }
                    ]
                });
            }
            if (status && status != '') {
                and_clause.push({
                    status: status
                });
            }
            if (and_clause.length > 0) {
                conditions['$and'] = and_clause;
            } else {
                conditions = {};
            }
            let sortOperator = { $sort: {} } as any;
            if (sortField && sortOrder) {
                sortOperator['$sort'][sortField] = sortOrder;
            } else {
                sortOperator['$sort']['_id'] = -1;
            }
            const aggregate = await prisma.order.aggregateRaw({
                pipeline: [
                    { $match: conditions },
                    sortOperator,
                    {
                        $facet: {
                            paginatedResults: [
                                { $skip: skip },
                                { $limit: pageSize },
                                {
                                    $project: {
                                        _id: { $toString: '$_id' },
                                        jobLink: 1,
                                        resume: 1,
                                        coverLetter: 1,
                                        status: 1
                                    }
                                }
                            ],
                            totalCount: [{ $count: 'count' }]
                        }
                    },
                    {
                        $project: {
                            paginatedResults: 1,
                            totalCount: {
                                $cond: {
                                    if: { $eq: [{ $round: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] }, null] },
                                    then: 0,
                                    else: { $round: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] }
                                }
                            },
                            totalPages: {
                                $cond: {
                                    if: { $eq: [{ $ceil: { $divide: [{ $arrayElemAt: ['$totalCount.count', 0] }, pageSize] } }, null] },
                                    then: 1,
                                    else: {
                                        $cond: {
                                            if: { $eq: [{ $ceil: { $divide: [{ $arrayElemAt: ['$totalCount.count', 0] }, pageSize] } }, 0] },
                                            then: 1,
                                            else: { $ceil: { $divide: [{ $arrayElemAt: ['$totalCount.count', 0] }, pageSize] } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ],
            });
            return { code: 200, message: "Order list fetched", success: true, data: aggregate }

        } catch (err) {
            throw err;
        }
    }
    async updateStatus(body: any): Promise<IResponse> {
        try {
            const { orderId, status, reason } = body;
            const updateOrder = await prisma.order.update({ data: { status: status, reason:reason }, where: { id: orderId } })
            if (!updateOrder) return { code: 400, message: "Something went wrong", success: false };
            return { success: true, code: 200, message: "Status updated successfully", data: updateOrder }
        } catch (err) {
            throw err;
        }
    }
}