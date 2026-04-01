import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from './button'
import { useToast } from '@/components/Toast'

interface ExportButtonProps {
  onExport: () => Promise<void>
  filters?: Record<string, string>
  filename?: string
  className?: string
}

export function ExportButton({
  onExport,
  filters = {},
  filename = 'export',
  className = ''
}: ExportButtonProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      await onExport()
      showToast('success', '导出成功')
    } catch (error) {
      showToast('error', '导出失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      loading={loading}
      loadingText="导出中..."
      disabled={loading}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? '导出中...' : '导出'}
    </Button>
  )
}
