import { useEffect, useRef } from 'react'

const useResetFormOnCloseModal = ({ form, visible }: any) => {
  const prevVisibleRef = useRef()
  useEffect(() => {
    prevVisibleRef.current = visible
  }, [visible])
  const prevVisible = prevVisibleRef.current

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields()
    }
  }, [form, prevVisible, visible])
}

export default useResetFormOnCloseModal
