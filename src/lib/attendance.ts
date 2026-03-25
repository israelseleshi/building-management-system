import dayjs from "dayjs"

export type AttendanceStatus = "On Time" | "Slight Late" | "Late" | "Closed"
export type IssueType = "Late" | "Not Opened"
export type LogValidity = "valid" | "invalid"
export type IssueSeverity = "slight" | "medium" | "high" | "critical"

export type Shop = {
  id: string
  name: string
  unit: string
  location: string
  opening_time: string
  grace_period: number
  fingerprint_user_ids: string[]
  active: boolean
}

export type DeviceLog = {
  id: string
  deviceId: string
  userId: string
  shopId: string | null
  timestamp: string
  status: LogValidity
}

export type ManualAdjustment = {
  id: string
  shopId: string
  date: string
  newStatus: AttendanceStatus
  notes: string
  updatedBy: string
  updatedAt: string
}

export type AttendanceConfig = {
  defaultOpeningTime: string
  gracePeriodMinutes: number
  lateThresholdMinutes: number
  severityRules: {
    slightLateMaxMinutes: number
    mediumLateMaxMinutes: number
    highLateMaxMinutes: number
  }
  notificationRules: {
    notifyLateAfterMinutes: number
    notifyClosedAt: string
  }
  penaltyRules: {
    latePenaltyEnabled: boolean
    closedPenaltyEnabled: boolean
  }
  shopOverrides: Record<string, { openingTime: string; gracePeriod: number }>
}

export type AttendanceRecord = {
  shopId: string
  shopName: string
  unit: string
  location: string
  date: string
  status: AttendanceStatus
  openingTime: string
  actualCheckInTime: string | null
  delayMinutes: number
  actualLogs: DeviceLog[]
}

export type ExceptionRecord = {
  shopId: string
  shopName: string
  unit: string
  issueType: IssueType
  delayDuration: number
  date: string
  severity: IssueSeverity
}

export type WarningAction = {
  id: string
  shopId: string
  shopName: string
  unit: string
  date: string
  templateId: string
  templateName: string
  channel: "email" | "sms" | "in-app"
  recipient: string
  message: string
  sentBy: string
  sentAt: string
}

type AttendanceStore = {
  shops: Shop[]
  deviceLogs: DeviceLog[]
  manualAdjustments: ManualAdjustment[]
  warningActions: WarningAction[]
  config: AttendanceConfig
}

const buildInitialShops = (): Shop[] => [
  {
    id: "shop-101",
    name: "Selam Fashion",
    unit: "G-01",
    location: "Ground Floor",
    opening_time: "09:00",
    grace_period: 10,
    fingerprint_user_ids: ["fp-1001", "fp-1002"],
    active: true,
  },
  {
    id: "shop-102",
    name: "Abyssinia Electronics",
    unit: "G-08",
    location: "Ground Floor",
    opening_time: "09:00",
    grace_period: 12,
    fingerprint_user_ids: ["fp-1003", "fp-1004"],
    active: true,
  },
  {
    id: "shop-201",
    name: "Blue Nile Cafe",
    unit: "F-12",
    location: "First Floor",
    opening_time: "08:30",
    grace_period: 15,
    fingerprint_user_ids: ["fp-1005"],
    active: true,
  },
  {
    id: "shop-202",
    name: "Habesha Books",
    unit: "F-19",
    location: "First Floor",
    opening_time: "09:30",
    grace_period: 10,
    fingerprint_user_ids: ["fp-1006", "fp-1007"],
    active: true,
  },
  {
    id: "shop-301",
    name: "Ethio Mobile Hub",
    unit: "S-04",
    location: "Second Floor",
    opening_time: "10:00",
    grace_period: 8,
    fingerprint_user_ids: ["fp-1008"],
    active: false,
  },
]

const buildInitialLogs = (): DeviceLog[] => {
  const base = dayjs().startOf("day")
  return [
    { id: "log-1", deviceId: "DEV-A1", userId: "fp-1001", shopId: "shop-101", timestamp: base.hour(8).minute(57).toISOString(), status: "valid" },
    { id: "log-2", deviceId: "DEV-A1", userId: "fp-1003", shopId: "shop-102", timestamp: base.hour(9).minute(14).toISOString(), status: "valid" },
    { id: "log-3", deviceId: "DEV-B2", userId: "fp-1005", shopId: "shop-201", timestamp: base.hour(8).minute(41).toISOString(), status: "valid" },
    { id: "log-4", deviceId: "DEV-B2", userId: "fp-1006", shopId: "shop-202", timestamp: base.hour(9).minute(52).toISOString(), status: "valid" },
    { id: "log-5", deviceId: "DEV-C3", userId: "fp-9999", shopId: null, timestamp: base.hour(8).minute(45).toISOString(), status: "invalid" },
    { id: "log-6", deviceId: "DEV-A1", userId: "fp-1002", shopId: "shop-101", timestamp: base.subtract(1, "day").hour(9).minute(2).toISOString(), status: "valid" },
    { id: "log-7", deviceId: "DEV-A1", userId: "fp-1004", shopId: "shop-102", timestamp: base.subtract(1, "day").hour(9).minute(26).toISOString(), status: "valid" },
    { id: "log-8", deviceId: "DEV-B2", userId: "fp-1005", shopId: "shop-201", timestamp: base.subtract(1, "day").hour(8).minute(29).toISOString(), status: "valid" },
    { id: "log-9", deviceId: "DEV-B2", userId: "fp-1006", shopId: "shop-202", timestamp: base.subtract(2, "day").hour(9).minute(31).toISOString(), status: "valid" },
  ]
}

const initialConfig: AttendanceConfig = {
  defaultOpeningTime: "09:00",
  gracePeriodMinutes: 10,
  lateThresholdMinutes: 30,
  severityRules: {
    slightLateMaxMinutes: 10,
    mediumLateMaxMinutes: 20,
    highLateMaxMinutes: 40,
  },
  notificationRules: {
    notifyLateAfterMinutes: 15,
    notifyClosedAt: "10:30",
  },
  penaltyRules: {
    latePenaltyEnabled: true,
    closedPenaltyEnabled: true,
  },
  shopOverrides: {
    "shop-201": { openingTime: "08:30", gracePeriod: 15 },
    "shop-202": { openingTime: "09:30", gracePeriod: 10 },
  },
}

const normalizeAttendanceConfig = (config?: Partial<AttendanceConfig> | null): AttendanceConfig => ({
  defaultOpeningTime: config?.defaultOpeningTime ?? initialConfig.defaultOpeningTime,
  gracePeriodMinutes: config?.gracePeriodMinutes ?? initialConfig.gracePeriodMinutes,
  lateThresholdMinutes: config?.lateThresholdMinutes ?? initialConfig.lateThresholdMinutes,
  severityRules: {
    ...initialConfig.severityRules,
    ...config?.severityRules,
  },
  notificationRules: {
    ...initialConfig.notificationRules,
    ...config?.notificationRules,
  },
  penaltyRules: {
    ...initialConfig.penaltyRules,
    ...config?.penaltyRules,
  },
  shopOverrides: {
    ...initialConfig.shopOverrides,
    ...config?.shopOverrides,
  },
})

const createInitialStore = (): AttendanceStore => ({
  shops: buildInitialShops(),
  deviceLogs: buildInitialLogs(),
  manualAdjustments: [
    {
      id: "manual-1",
      shopId: "shop-202",
      date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
      newStatus: "On Time",
      notes: "Technical issue with scanner confirmed by security desk.",
      updatedBy: "Admin",
      updatedAt: dayjs().subtract(2, "day").hour(11).toISOString(),
    },
  ],
  warningActions: [
    {
      id: "warning-1",
      shopId: "shop-102",
      shopName: "Abyssinia Electronics",
      unit: "G-08",
      date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      templateId: "warning-late-followup",
      templateName: "Late Opening Follow-up",
      channel: "email",
      recipient: "manager@abyssiniaelectronics.et",
      message: "Your business opened late yesterday. Please review your opening compliance procedures.",
      sentBy: "Admin",
      sentAt: dayjs().subtract(1, "day").hour(11).toISOString(),
    },
  ],
  config: initialConfig,
})

declare global {
  var __attendanceStore__: AttendanceStore | undefined
}

const attendanceStore = globalThis.__attendanceStore__ ?? createInitialStore()
if (!globalThis.__attendanceStore__) {
  globalThis.__attendanceStore__ = attendanceStore
}
attendanceStore.config = normalizeAttendanceConfig(attendanceStore.config)
attendanceStore.warningActions = Array.isArray(attendanceStore.warningActions) ? attendanceStore.warningActions : []

const toMinutes = (timeValue: string) => {
  const [hours, minutes] = timeValue.split(":").map(Number)
  return hours * 60 + minutes
}

const getShopOpeningConfig = (shop: Shop, config: AttendanceConfig) => {
  const override = config.shopOverrides[shop.id]
  return {
    openingTime: override?.openingTime ?? shop.opening_time ?? config.defaultOpeningTime,
    gracePeriod: override?.gracePeriod ?? shop.grace_period ?? config.gracePeriodMinutes,
  }
}

export const getAttendanceStore = () => attendanceStore

export const processAttendanceRecords = (params?: {
  startDate?: string
  endDate?: string
  shopId?: string
  unit?: string
  location?: string
  status?: string
  include?: "all" | "active"
}) => {
  const store = getAttendanceStore()
  const startDate = dayjs(params?.startDate || dayjs().format("YYYY-MM-DD"))
  const endDate = dayjs(params?.endDate || params?.startDate || dayjs().format("YYYY-MM-DD"))
  const records: AttendanceRecord[] = []

  for (let cursor = startDate.startOf("day"); cursor.isBefore(endDate.endOf("day")) || cursor.isSame(endDate, "day"); cursor = cursor.add(1, "day")) {
    for (const shop of store.shops) {
      if (params?.include === "active" && !shop.active) continue
      if (params?.shopId && shop.id !== params.shopId) continue
      if (params?.unit && params.unit !== "all" && shop.unit !== params.unit) continue
      if (params?.location && params.location !== "all" && shop.location !== params.location) continue

      const dayKey = cursor.format("YYYY-MM-DD")
      const logsForShop = store.deviceLogs
        .filter((log) => log.shopId === shop.id && dayjs(log.timestamp).format("YYYY-MM-DD") === dayKey && log.status === "valid")
        .sort((a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf())

      const { openingTime, gracePeriod } = getShopOpeningConfig(shop, store.config)
      const openingMinutes = toMinutes(openingTime)
      const actualCheckIn = logsForShop[0] ? dayjs(logsForShop[0].timestamp) : null
      const actualMinutes = actualCheckIn ? actualCheckIn.hour() * 60 + actualCheckIn.minute() : null
      const delayMinutes = actualMinutes == null ? 0 : Math.max(actualMinutes - openingMinutes, 0)

      let computedStatus: AttendanceStatus = "Closed"
      if (actualMinutes != null) {
        if (actualMinutes <= openingMinutes) {
          computedStatus = "On Time"
        } else if (actualMinutes <= openingMinutes + gracePeriod) {
          computedStatus = "Slight Late"
        } else {
          computedStatus = "Late"
        }
      }

      const manualOverride = store.manualAdjustments.find(
        (adjustment) => adjustment.shopId === shop.id && adjustment.date === dayKey
      )

      const finalStatus = manualOverride?.newStatus ?? computedStatus
      const record: AttendanceRecord = {
        shopId: shop.id,
        shopName: shop.name,
        unit: shop.unit,
        location: shop.location,
        date: dayKey,
        status: finalStatus,
        openingTime,
        actualCheckInTime: actualCheckIn ? actualCheckIn.format("HH:mm") : null,
        delayMinutes: finalStatus === "Closed" ? 0 : delayMinutes,
        actualLogs: logsForShop,
      }

      if (params?.status && params.status !== "all" && record.status !== params.status) {
        continue
      }

      records.push(record)
    }
  }

  const summary = {
    totalShops: records.length,
    onTime: records.filter((record) => record.status === "On Time").length,
    late: records.filter((record) => record.status === "Late" || record.status === "Slight Late").length,
    closed: records.filter((record) => record.status === "Closed").length,
  }

  return { records, summary }
}

export const processExceptions = (params?: { startDate?: string; endDate?: string; severity?: string }) => {
  const store = getAttendanceStore()
  const { records } = processAttendanceRecords(params)
  const exceptions: ExceptionRecord[] = records
    .filter((record) => record.status === "Late" || record.status === "Slight Late" || record.status === "Closed")
    .map((record) => {
      let severity: IssueSeverity = "critical"
      if (record.status !== "Closed") {
        if (record.delayMinutes <= store.config.severityRules.slightLateMaxMinutes) {
          severity = "slight"
        } else if (record.delayMinutes <= store.config.severityRules.mediumLateMaxMinutes) {
          severity = "medium"
        } else if (record.delayMinutes <= store.config.severityRules.highLateMaxMinutes) {
          severity = "high"
        } else {
          severity = "critical"
        }
      }

      return {
        shopId: record.shopId,
        shopName: record.shopName,
        unit: record.unit,
        issueType: record.status === "Closed" ? "Not Opened" : "Late",
        delayDuration: record.status === "Closed" ? 0 : record.delayMinutes,
        date: record.date,
        severity,
      }
    })

  return params?.severity && params.severity !== "all"
    ? exceptions.filter((exception) => exception.severity === params.severity)
    : exceptions
}

export const getDeviceLogs = (params?: { deviceId?: string; date?: string; userId?: string }) => {
  const store = getAttendanceStore()
  return store.deviceLogs.filter((log) => {
    if (params?.deviceId && params.deviceId !== "all" && log.deviceId !== params.deviceId) return false
    if (params?.date && dayjs(log.timestamp).format("YYYY-MM-DD") !== params.date) return false
    if (params?.userId && !log.userId.toLowerCase().includes(params.userId.toLowerCase())) return false
    return true
  })
}

export const addDeviceLog = (payload: {
  deviceId: string
  userId: string
  timestamp: string
  status?: LogValidity
}) => {
  const store = getAttendanceStore()
  const mappedShop = store.shops.find((shop) => shop.fingerprint_user_ids.includes(payload.userId))
  const newLog: DeviceLog = {
    id: `log-${Date.now()}`,
    deviceId: payload.deviceId,
    userId: payload.userId,
    shopId: mappedShop?.id ?? null,
    timestamp: payload.timestamp,
    status: payload.status ?? (mappedShop ? "valid" : "invalid"),
  }
  store.deviceLogs.unshift(newLog)
  return newLog
}

export const addManualAdjustment = (payload: {
  shopId: string
  date: string
  newStatus: AttendanceStatus
  notes: string
  updatedBy?: string
}) => {
  const store = getAttendanceStore()
  const adjustment: ManualAdjustment = {
    id: `manual-${Date.now()}`,
    shopId: payload.shopId,
    date: payload.date,
    newStatus: payload.newStatus,
    notes: payload.notes,
    updatedBy: payload.updatedBy || "Admin",
    updatedAt: dayjs().toISOString(),
  }
  store.manualAdjustments.unshift(adjustment)
  return adjustment
}

export const addWarningAction = (payload: Omit<WarningAction, "id" | "sentAt">) => {
  const store = getAttendanceStore()
  const warning: WarningAction = {
    id: `warning-${Date.now()}`,
    sentAt: dayjs().toISOString(),
    ...payload,
  }
  store.warningActions.unshift(warning)
  return warning
}

export const updateAttendanceConfig = (payload: Partial<AttendanceConfig>) => {
  const store = getAttendanceStore()
  store.config = normalizeAttendanceConfig({
    ...store.config,
    ...payload,
  })
  return store.config
}
