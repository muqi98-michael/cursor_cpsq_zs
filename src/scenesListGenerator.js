const fs = require("fs");
const path = require("path");

function loadScenesInput() {
  const filePath = path.join(__dirname, "..", "data", "scenes-list.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getStatusTone(status) {
  if (status === "已完善") return "done";
  if (status === "待完善") return "pending";
  return "editing";
}

function generateScenesListContent(input) {
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    page: input.page,
    filters: input.filters,
    tableColumns: input.tableColumns,
    rows: input.rows.map((row) => ({
      ...row,
      statusTone: getStatusTone(row.status),
      actions: ["查看", "编辑", "更多"]
    })),
    pagination: input.pagination
  };
}

function getScenesListContent() {
  const input = loadScenesInput();
  return generateScenesListContent(input);
}

function getSceneDetail(sceneId) {
  const scenes = getScenesListContent().rows;
  const scene = scenes.find((item) => item.sceneId === sceneId);
  if (!scene) return null;

  const defaultDetail = {
    subtitle: "基于业务流程沉淀的标准化场景实践",
    description: `${scene.name} 围绕“${scene.painPoint}”建设统一业务协同能力，覆盖关键流程节点，实现效率与质量双提升。`,
    roles: [
      { name: "业务负责人", desc: "负责场景目标设定与推进落地" },
      { name: "产品经理", desc: "负责流程设计、需求拆解与迭代" },
      { name: "运营专员", desc: "负责执行跟踪与效果评估" }
    ],
    pains: [
      { title: "流程协作割裂", desc: "跨团队信息同步不及时，协同成本高" },
      { title: "执行效率偏低", desc: "人工环节多，处理周期长且易出错" },
      { title: "数据可视性不足", desc: "缺乏统一指标与过程追踪能力" },
      { title: "持续优化困难", desc: "缺少闭环复盘机制，改进难沉淀" }
    ],
    goals: [
      { title: "统一协作流程", desc: "建立标准化业务流转与协同机制" },
      { title: "提升执行效率", desc: "通过自动化与规则化缩短处理周期" },
      { title: "强化数据驱动", desc: "沉淀关键指标并支持过程可追溯" },
      { title: "形成复用资产", desc: "将最佳实践模板化并复制推广" }
    ],
    features: [
      { title: "流程看板", desc: "关键节点状态可视化，支持实时跟踪" },
      { title: "任务编排", desc: "按规则自动分发任务与通知提醒" },
      { title: "指标分析", desc: "多维统计分析辅助业务决策优化" },
      { title: "权限协同", desc: "按角色授权保障流程安全合规" },
      { title: "文档沉淀", desc: "场景资料与经验在线管理复用" }
    ],
    solutions: [
      "场景协同管理平台解决方案",
      "流程数字化转型解决方案"
    ],
    cases: [
      "某制造企业协同平台建设案例",
      "某零售企业流程提效实践案例"
    ],
    attachments: [
      { name: "场景需求规格说明书.pdf", size: "2.4MB" },
      { name: "场景评估指标体系.xlsx", size: "1.2MB" }
    ]
  };

  const supplierDetail = {
    name: "供应商协同场景",
    editor: "小王",
    updatedAt: "2023-11-15",
    status: "已完善",
    statusTone: "done",
    subtitle: "实现供应商与企业之间的高效协同与信息共享",
    description:
      "供应商协同场景旨在通过数字化平台实现企业与供应商之间的高效协作，整合采购、库存、财务等业务流程，建立快速、高效的供应链协同体系。该场景覆盖供应商准入、订单管理、交付跟踪、绩效评估等全流程，通过信息共享和流程自动化，提升供应链响应速度，降低运营成本，增强供应链韧性。",
    roles: [
      { name: "采购经理", desc: "负责供应商选择、评估和关系管理" },
      { name: "供应商管理员", desc: "负责供应商信息维护和协同流程管理" },
      { name: "仓库管理员", desc: "负责物料接收、入库和库存管理" },
      { name: "财务专员", desc: "负责供应商对账和付款流程" }
    ],
    pains: [
      { title: "信息沟通不畅", desc: "供应商与企业之间信息传递不及时，导致订单延迟和误解" },
      { title: "订单处理效率低", desc: "人工处理订单流程繁琐，容易出错，处理周期长" },
      { title: "供应商绩效评估困难", desc: "缺乏客观数据支持，评估过程主观，难以持续改进供应商表现" },
      { title: "库存信息不透明", desc: "供应商无法及时了解企业库存状况，导致供货不及时或过度库存" }
    ],
    goals: [
      { title: "提高沟通效率", desc: "实现供应商与企业之间的实时信息共享，减少沟通成本" },
      { title: "优化订单处理流程", desc: "实现订单自动化处理，缩短订单周期，减少人工错误" },
      { title: "提升供应商绩效", desc: "建立客观的供应商评估体系，激励供应商持续改进" },
      { title: "降低库存成本", desc: "通过信息共享实现精准补货，减少库存积压和缺货风险" }
    ],
    features: [
      { title: "供应商门户", desc: "供应商登录平台查看订单、库存和付款信息，提交报价和发票" },
      { title: "电子订单管理", desc: "在线创建、发送和跟踪订单，支持电子签名确认" },
      { title: "供应商绩效评估", desc: "基于交付时间、质量、价格等多维度自动评估供应商表现" },
      { title: "库存共享", desc: "向供应商开放库存信息，实现按需供货和JIT生产" },
      { title: "电子对账与付款", desc: "自动匹配订单与发票，支持在线对账和电子付款" }
    ],
    solutions: ["供应商协同管理平台解决方案", "供应商数字化转型解决方案"],
    cases: ["某汽车制造企业供应商协同平台建设案例", "电子制造企业供应商协同降本案例"],
    attachments: [
      { name: "供应商协同平台需求规格说明书.pdf", size: "2.4MB" },
      { name: "供应商评估指标体系.xlsx", size: "1.2MB" }
    ]
  };

  const isSupplierScene = scene.sceneId === "SC-2023002";
  const detail = isSupplierScene ? supplierDetail : defaultDetail;

  return {
    ...scene,
    ...detail
  };
}

module.exports = {
  getScenesListContent,
  getSceneDetail
};
