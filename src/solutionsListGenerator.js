const fs = require("fs");
const path = require("path");

function loadSolutionsInput() {
  const filePath = path.join(__dirname, "..", "data", "solutions-list.input.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function getStatusTone(status) {
  if (status === "已发布") return "done";
  if (status === "开发中") return "editing";
  if (status === "待发布") return "pending";
  if (status === "已下架") return "offline";
  return "editing";
}

function getSolutionsListContent() {
  const input = loadSolutionsInput();
  return {
    source: input.meta,
    sidebar: input.sidebar,
    topbar: input.topbar,
    page: input.page,
    filters: input.filters,
    tableColumns: input.tableColumns,
    rows: input.rows.map((row) => ({
      ...row,
      statusTone: getStatusTone(row.status)
    })),
    pagination: input.pagination
  };
}

function getSolutionDetail(solutionId) {
  const list = getSolutionsListContent().rows;
  const solution = list.find((item) => item.solutionId === solutionId);
  if (!solution) return null;

  const detailMap = {
    "SO-20231101": {
      subtitle: "围绕财务共享中心建设统一流程与数据标准",
      description:
        "该方案通过统一核算、费用报销、应收应付协同与预算控制能力，帮助企业提升财务作业效率，降低重复操作和人为差错，实现财务流程标准化、可追踪、可分析。",
      editor: "王小明",
      updatedAt: "2023-11-14 09:25",
      relatedProducts: ["财务云"],
      relatedDomains: ["财务管理"],
      relatedApps: ["财务共享平台", "预算管理"],
      heroImage:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
      flowImage:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
      modules: [
        {
          title: "统一核算管理",
          desc: "支持多组织、多账簿并行核算，自动汇总关键指标，提升核算准确性和处理效率。"
        },
        {
          title: "费用报销协同",
          desc: "覆盖申请、审批、报销、归档全流程，支持移动端填报和自动校验。"
        },
        {
          title: "应收应付联动",
          desc: "建立应收应付协同视图，实时掌握账龄、回款与付款节奏，降低资金风险。"
        }
      ]
    },
    "SO-20231102": {
      subtitle: "实现供应链上下游高效协同与透明管理",
      description:
        "某汽车制造集团是国内领先的汽车生产企业，拥有多个生产基地和数百余家供应商，年采购金额超过100亿元。随着业务规模的扩大，原有的传统管理模式面临诸多挑战：供应商数量庞大且分散，沟通效率低下，采购流程繁琐，手工操作比例高，供应商信息不透明，难以实时监控，库存占用大，供应商绩效评估缺乏数据支持。",
      editor: "张磊",
      updatedAt: "2023-11-15 09:25",
      company: "某汽车制造集团有限公司",
      industryName: "汽车制造业",
      relatedProducts: ["供应链云"],
      relatedDomains: ["供应商管理", "采购管理", "库存管理", "合同管理系统"],
      relatedApps: ["供应商协同平台"],
      projectBackground: [
        "某汽车制造集团是国内领先的汽车生产企业，拥有多个生产基地和数百余家供应商，年采购金额超过100亿元。随着业务规模的扩大，原有的传统管理模式面临诸多挑战：供应商数量庞大且分散，沟通效率低下，采购流程繁琐，手工操作比例高，供应商信息不透明，难以实时监控，库存占用大，供应商绩效评估缺乏数据支持。",
        "为解决上述问题，该企业决定实施供应链协同管理平台，通过数字化手段优化供应链流程，提升协同效率，降低运营成本，增强供应链竞争力。"
      ],
      painPoints: [
        "供应商管理分散：供应商数量超过500家，分布在全国各地，信息分散在不同系统和Excel表格中，难以统一管理",
        "采购流程效率低：采购申请、审批、订单创建等流程主要依靠邮件和纸质文档，平均采购周期长达15天",
        "信息不透明：供应商和库存信息不实时，无法及时掌握订单状态、库存水平和物流信息",
        "库存积压严重：原材料库存周转率低，平均库存周转天数达60天，占用资金超过10亿元",
        "供应商评估困难：缺乏量化的供应商绩效评估体系，难以科学评估供应商表现"
      ],
      featureDetails: [
        {
          title: "供应商生命周期管理",
          desc: "建立统一的供应商信息管理平台，实现供应商准入、信息维护、绩效评估和分级管理，支持供应商资质文件上传和审核，自动提醒资质到期，帮助企业建立合格供应商库。"
        },
        {
          title: "电子采购协同平台",
          desc: "实现采购需求、采购计划、招投标、订单、收货、发票的全流程电子化管理，支持与ERP系统集成，实现数据自动同步，采购周期缩短40%。"
        },
        {
          title: "供应链可视化",
          desc: "通过供应链仪表板实时展示关键指标，包括订单履行率、库存水平、供应商绩效等。支持多维度数据分析，帮助管理层及时掌握供应链状况。"
        },
        {
          title: "VMI库存管理",
          desc: "支持供应商管理库存(VMI)模式，供应商可实时查看库存水平，主动补货。系统根据生产计划和历史数据自动生成补货建议，降低库存成本。"
        },
        {
          title: "供应商绩效评估",
          desc: "建立多维度供应商绩效评估体系，包括质量、交付、价格、服务等指标。支持自动计算绩效分数，生成评估报告，为供应商分级和合作决策提供依据。"
        }
      ],
      valueItems: [
        { title: "采购周期缩短", desc: "采购的平均周期从15天缩短至9天，效率提升40%", tone: "blue" },
        { title: "库存成本降低", desc: "原材料库存周转天数从60天降至45天，库存成本降低25%", tone: "green" },
        { title: "采购成本节约", desc: "通过集中采购和供应商优化，年采购成本节约约1.2亿元", tone: "purple" },
        { title: "供应商绩效提升", desc: "供应商按时交付率从85%提升至98%，质量合格率提升至99.5%", tone: "yellow" },
        { title: "人力成本节约", desc: "采购部门工作效率提升50%，减少人工工作量约30%", tone: "orange" }
      ],
      relatedScenes: ["供应商协同场景", "采购协同场景", "库存优化场景"],
      relatedResources: ["供应商协同管理平台解决方案", "供应商关系管理解决方案", "数字化采购解决方案"],
      heroImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      flowImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      modules: [
        {
          title: "供应商生命周期管理",
          desc: "建立统一的供应商信息管理平台，实现供应商准入、信息维护、绩效评估和分级管理。支持供应商资质文件上传与审核，并自动提醒资质到期。"
        },
        {
          title: "供应链可视化与预警",
          desc: "通过供应链仪表盘实时展示订单履行率、库存水平、供应商绩效等关键指标，支持多维度分析与异常预警。"
        },
        {
          title: "供应商管理库存（VMI）",
          desc: "支持供应商管理库存模式，供应商可实时查看库存并主动补货。系统根据生产计划与历史数据自动生成补货建议。"
        },
        {
          title: "供应商绩效评估",
          desc: "建立覆盖质量、交付、价格、服务的绩效评估体系，自动计算评分并生成评估报告，为分级合作与优化决策提供依据。"
        }
      ]
    }
  };

  const fallback = {
    subtitle: "提供标准化、可复用的业务解决方案能力",
    description:
      `${solution.name}聚焦行业场景共性问题，沉淀流程标准、功能模块与实施路径，帮助团队快速复制最佳实践并持续优化运营效果。`,
    editor: solution.editor,
    updatedAt: `${solution.updatedAt} 09:25`,
    relatedProducts: [solution.industry],
    relatedDomains: [solution.industry],
    relatedApps: ["业务协同平台"],
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    flowImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    modules: [
      {
        title: "方案架构设计",
        desc: "明确目标能力、核心流程与关键指标，形成可落地的架构蓝图。"
      },
      {
        title: "业务流程优化",
        desc: "围绕关键场景拆解流程节点，减少人工干预，提升协作效率。"
      },
      {
        title: "数据分析与评估",
        desc: "建立效果评估指标体系，支持过程追踪与持续迭代。"
      }
    ]
  };

  return {
    ...solution,
    ...(detailMap[solutionId] || fallback)
  };
}

module.exports = {
  getSolutionsListContent,
  getSolutionDetail
};
