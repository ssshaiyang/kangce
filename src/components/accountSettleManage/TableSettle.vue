<template>
    <div>
        <el-table
        :data="tableData"
        size="medium "
        border
        max-height="460"
        style="width: 100%">
            <el-table-column
            prop="number"
            label="结算号"
            fixed
            width="200">
            </el-table-column>

            <el-table-column
            prop="month"
            label="结算月份"
            min-width="100">
            </el-table-column>

            <el-table-column
            prop="docName"
            label="用户名"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="phone"
            label="手机号"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="docId"
            label="Uid"
            min-width="200">
            </el-table-column>

            <el-table-column
            label="持卡人姓名"
            min-width="200">
                <template slot-scope="scope">
                    -
                </template>
            </el-table-column>

            <el-table-column
            prop="bank"
            label="开户行"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="subbranch"
            label="支行"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="account"
            label="银行卡号"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="balance"
            label="线上结算金额"
            min-width="200">
                <template slot-scope="scope">
                    {{(!scope.row.balance && scope.row.balance !== 0) ? '-' : scope.row.balance}}(义诊：{{(!scope.row.treatmentMoney && scope.row.treatmentMoney !== 0) ? '-' : scope.row.treatmentMoney}} )
                </template>
            </el-table-column>

            <el-table-column
            prop="dueMoney"
            label="线下结算金额"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="dueMoney"
            label="扣款项目"
            min-width="200">
                <template slot-scope="scope">
                    服务费 - 元 + 税费 {{scope.row.tax}} 元
                </template>
            </el-table-column>

            <el-table-column
            prop="workHour"
            label="本月工作时间（h）"
            min-width="200">
                <template slot-scope="scope">
                    {{scope.row.workHour}}({{scope.row.requireTime}})
                </template>
            </el-table-column>

            <el-table-column
            prop="deductMoney"
            label="扣款金额"
            min-width="200">
            </el-table-column>

            <el-table-column
            prop="factMoney"
            label="实际打款"
            min-width="200">
            </el-table-column>

            <el-table-column
            label="结算状态"
            width="200"
            fixed="right">
                <template slot-scope="scope">
                    <!-- 状态 0-未打款 1-已打款 -->
                    <el-button v-if="scope.row.status === 0" type="text" size="mini" @click="comfirmCapital(scope.row)">{{
                        statusSettle[scope.row.status]
                    }}</el-button>
                    <p v-else>{{
                        statusSettle[scope.row.status]
                    }}</p>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    comfirmCapitalAPI,
} from '@/api/accountMagageAPI.js';

export default {
    name:'',
    data() {
        return {
            statusSettle: {
                0: '未打款',
                1: '已打款',
            },
        };
    },
    props: {
        tableData: {
            required: true,
            type: Array,
        },
    },
    methods: {
        /**
         * 确认打款
         * @param {Object} row 行信息
         */
        comfirmCapital(row) {
            this.$confirm(`
            <p>
                是否确认已经完成对（${row.docName}，${row.phone}）该笔打款？
            </p>
            <div style="margin: 8px auto 6px;padding: 12px; text-indent: 28px; border: 1px solid #e0e0e0; border-radius: 6px;">
                <b>${row.month}</b> 结算金额已发放至 <b>${row.bank}</b> 银行（银行卡尾号4位为 <b>${row.account.slice(-4)}</b> ），结算金额共为 <b>${parseFloat(row.balance) + parseFloat(row.dueMoney)}</b> 元，代缴税费 <b>${row.tax}</b> 元，实际所得金额为 <b>${row.factMoney} </b>元。
            </div>
            `, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    comfirmCapitalAPI({id: row.id})
                        .then((res) => {
                            const response = res.data;
                            let type = 'success';
                            let message = '确认打款成功！';

                            if (response.code === 1000) {
                                this.$emit('refresh-list');
                            } else {
                                this.message = response.msg;   
                            }
                            this.$message({
                                type: type,
                                message: message,
                            });
                        });
                })
                .catch(() => {});
        },
    },
};
</script>

<style scoped>

</style>