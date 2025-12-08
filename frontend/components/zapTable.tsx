'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Search,
  Trash2,
  Plus,
  Filter,
  Bookmark,
  RotateCw,
  ChevronDown,
  MoreVertical,
  Zap,
  FolderOpen,
  ArrowUpDown,
} from 'lucide-react'
import axios from 'axios'

interface AvailableAction {
  id: string
  name: string
  image?: string | null
}

interface AvailableTrigger {
  id: string
  name: string
  image?: string | null
}

interface Action {
  id: string
  actionId: string
  metadata?: any
  sortingOrder: number
  type: AvailableAction
}

interface Trigger {
  id: string
  triggerId: string
  metadata?: any
  type: AvailableTrigger
}

interface Zap {
  id: string
  name?: string | null
  userId: string
  trigger?: Trigger | null
  actions: Action[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const ZapTable = () => {
  const [zaps, setZaps] = useState<Zap[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchZaps = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Token:', token);
        console.log('Backend URL:', BACKEND_URL);

        const response = await axios.get<{ zaps: Zap[] }>(`${BACKEND_URL}/api/v1/zap`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('Response:', response);
        console.log('Response data:', response.data);
        console.log('Zaps:', response.data.zaps);

        setZaps(response.data.zaps || [])
      } catch (error: unknown) {
        console.error('Failed to fetch zaps:', error)
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const axiosError = error as { response?: { data?: unknown; status?: number } };
          console.error('Response data:', axiosError.response?.data);
          console.error('Response status:', axiosError.response?.status);
        }
      } finally {
        setLoading(false)
      }
    }

    fetchZaps()
  }, [])

  const filteredZaps = zaps.filter(zap => {
    if (!searchQuery) return true
    const zapName = zap.name || 'Untitled Zap'
    return zapName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header Section */}
      <div className="max-w-[1600px] mx-auto">
        {/* Title and Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-bold">Zaps</h1>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex items-center gap-2"
            >
              <Trash2 className="h-5 w-5" />
              Trash
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-6">
              <Plus className="h-5 w-5" />
              Create
            </Button>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or webhook"
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="h-12 px-4 min-w-[140px] flex items-center justify-between border-gray-300"
          >
            <span>All Zaps</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            className="h-12 px-4 flex items-center gap-2 border-gray-300"
          >
            <Filter className="h-5 w-5" />
            Filters
          </Button>

          <Button variant="ghost" className="h-12 w-12 p-0">
            <Bookmark className="h-5 w-5 text-gray-600" />
          </Button>

          <Button variant="ghost" className="h-12 w-12 p-0">
            <RotateCw className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[30%] font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Apps</TableHead>
                <TableHead className="font-semibold text-gray-700">Location</TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Last modified
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Owner</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    Loading zaps...
                  </TableCell>
                </TableRow>
              ) : filteredZaps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    No zaps found
                  </TableCell>
                </TableRow>
              ) : (
                filteredZaps.map((zap) => (
                  <TableRow key={zap.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500" />
                        {zap.name || 'Untitled Zap'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {zap.trigger && (
                          <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                            {zap.trigger.type?.image ? (
                              <img
                                src={zap.trigger.type.image}
                                alt={zap.trigger.type.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <Zap className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        )}
                        {zap.actions.slice(0, 3).map((action, index) => (
                          <div
                            key={action.id}
                            className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-white overflow-hidden"
                          >
                            {action.type?.image ? (
                              <img
                                src={action.type.image}
                                alt={action.type.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <span className="text-xs font-medium">A{index + 1}</span>
                            )}
                          </div>
                        ))}
                        {zap.actions.length > 3 && (
                          <span className="text-xs text-gray-500 ml-1">+{zap.actions.length - 3}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FolderOpen className="h-4 w-4" />
                        <span>My Folder</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">Just now</TableCell>
                    <TableCell>
                      <Switch checked={false} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-medium">
                        SS
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Pagination */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            {filteredZaps.length > 0
              ? `1-${filteredZaps.length} of ${filteredZaps.length}`
              : '0 items'}
          </div>
          <Button
            variant="outline"
            className="h-10 px-4 flex items-center justify-between min-w-[160px] border-gray-300"
          >
            <span>100 per page</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ZapTable
