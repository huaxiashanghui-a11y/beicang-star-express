import { useState, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { useToast } from '@/components/Toast'

interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'file'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: string
  validation?: (value: string) => string | null
}

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, string>) => Promise<void>
  title: string
  fields: FormField[]
  submitText?: string
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  submitText = '确认',
  size = 'md',
  children
}: FormModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || ''
    })
    return initial
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach(field => {
      const value = formData[field.name] || ''

      // Required validation
      if (field.required && !value.trim()) {
        newErrors[field.name] = `请输入${field.label}`
        isValid = false
        return
      }

      // Custom validation
      if (value && field.validation) {
        const error = field.validation(value)
        if (error) {
          newErrors[field.name] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
      // Reset form
      const initial: Record<string, string> = {}
      fields.forEach(field => {
        initial[field.name] = field.defaultValue || ''
      })
      setFormData(initial)
      setErrors({})
    } catch (error) {
      showToast('error', '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in',
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    className={cn(
                      'w-full h-24 px-4 py-2.5 border-2 rounded-xl bg-white',
                      'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                      'disabled:bg-gray-100 disabled:cursor-not-allowed',
                      'transition-all duration-200 resize-none',
                      errors[field.name] ? 'border-red-500' : 'border-gray-200'
                    )}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    disabled={loading}
                    className={cn(
                      'w-full h-12 px-4 py-2 border-2 rounded-xl bg-white',
                      'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                      'disabled:bg-gray-100 disabled:cursor-not-allowed',
                      'transition-all duration-200',
                      errors[field.name] ? 'border-red-500' : 'border-gray-200'
                    )}
                  >
                    <option value="">{field.placeholder || '请选择'}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleChange(field.name, file.name)
                        }
                      }}
                      disabled={loading}
                      className="hidden"
                      id={`file-${field.name}`}
                    />
                    <label htmlFor={`file-${field.name}`} className="cursor-pointer">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formData[field.name] || '点击上传图片'}
                      </p>
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    className={cn(
                      'w-full h-12 px-4 py-2 border-2 rounded-xl bg-white',
                      'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                      'disabled:bg-gray-100 disabled:cursor-not-allowed',
                      'transition-all duration-200',
                      errors[field.name] ? 'border-red-500' : 'border-gray-200'
                    )}
                  />
                )}

                {/* Error message */}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Custom children */}
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            loadingText="提交中..."
            className="flex-1"
          >
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  )
}
