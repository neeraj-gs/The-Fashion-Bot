import { getAutomationService } from "../services/automationService.js"

export const startAutomation = async (req, res) => {
  const { storeName, orderData } = req.body
  const user = req.user
  const automationService = getAutomationService(storeName, orderData, user)
  if (!automationService) {
    return res.status(400).json({
      success: false,
      message: 'Invalid store name'
    })
  }
  const result = await automationService.run()
  res.json(result)
}