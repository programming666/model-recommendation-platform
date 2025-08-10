import { useNavigate } from 'react-router-dom'

export const useSearch = () => {
  const navigate = useNavigate()

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return { handleSearch }
}
