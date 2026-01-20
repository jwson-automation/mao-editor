import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import type { MaoTextFile, MaoFileListItem } from '~/types/editor'

export function useFirestore() {
  const { $db } = useNuxtApp()
  const { getCurrentUser } = useAuth()

  // Get collection path based on user login status
  function getCollectionPath(sessionId: string): string {
    const userId = getCurrentUser()
    if (userId) {
      return `user-documents/${userId}/files`
    }
    return `documents/${sessionId}/files`
  }

  // Save text file
  async function saveTextFile(sessionId: string, fileId: string, name: string, content: string, isAiGenerated?: boolean): Promise<boolean> {
    try {
      const now = new Date().toISOString()
      const textFile: MaoTextFile = {
        id: fileId,
        name,
        content,
        createdAt: now,
        updatedAt: now,
        isAiGenerated
      }

      const collectionPath = getCollectionPath(sessionId)
      await setDoc(doc($db, collectionPath, fileId), textFile)
      return true
    } catch (error) {
      console.error('Error saving text file:', error)
      return false
    }
  }

  // Load text file
  async function loadTextFile(sessionId: string, fileId: string): Promise<MaoTextFile | null> {
    try {
      const collectionPath = getCollectionPath(sessionId)
      const docRef = doc($db, collectionPath, fileId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data() as MaoTextFile
      }
      return null
    } catch (error) {
      console.error('Error loading text file:', error)
      return null
    }
  }

  // Load file list
  async function loadFileList(sessionId: string): Promise<MaoFileListItem[]> {
    try {
      const collectionPath = getCollectionPath(sessionId)
      const filesRef = collection($db, collectionPath)
      const q = query(filesRef, orderBy('updatedAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const files: MaoFileListItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as MaoTextFile
        files.push({
          id: data.id,
          name: data.name,
          updatedAt: data.updatedAt,
          isAiGenerated: data.isAiGenerated
        })
      })

      return files
    } catch (error) {
      console.error('Error loading file list:', error)
      return []
    }
  }

  // Delete file
  async function deleteTextFile(sessionId: string, fileId: string): Promise<boolean> {
    try {
      const collectionPath = getCollectionPath(sessionId)
      await deleteDoc(doc($db, collectionPath, fileId))
      return true
    } catch (error) {
      console.error('Error deleting text file:', error)
      return false
    }
  }

  // Rename file title
  async function renameTextFile(sessionId: string, fileId: string, newName: string): Promise<boolean> {
    try {
      const collectionPath = getCollectionPath(sessionId)
      const docRef = doc($db, collectionPath, fileId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as MaoTextFile
        await setDoc(docRef, {
          ...data,
          name: newName,
          updatedAt: new Date().toISOString(),
          isAiGenerated: false // Clear AI generated flag since manually changed
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Error renaming text file:', error)
      return false
    }
  }

  // Migrate local session documents to user account
  async function migrateLocalDocuments(sessionId: string, userId: string): Promise<{ success: boolean, migratedCount: number }> {
    try {
      const { $db } = useNuxtApp()

      // Get local session documents
      const localPath = `documents/${sessionId}/files`
      const localFilesRef = collection($db, localPath)
      const localQuery = query(localFilesRef, orderBy('updatedAt', 'desc'))
      const localSnapshot = await getDocs(localQuery)

      if (localSnapshot.empty) {
        return { success: true, migratedCount: 0 }
      }

      // Get user documents to check for duplicates
      const userPath = `user-documents/${userId}/files`
      const userFilesRef = collection($db, userPath)
      const userSnapshot = await getDocs(userFilesRef)
      const existingIds = new Set(userSnapshot.docs.map(doc => doc.id))

      // Migrate documents that don't exist in user collection
      let migratedCount = 0
      for (const docSnap of localSnapshot.docs) {
        const fileId = docSnap.id

        // Skip if already exists
        if (existingIds.has(fileId)) {
          continue
        }

        const data = docSnap.data() as MaoTextFile
        await setDoc(doc($db, userPath, fileId), data)
        migratedCount++
      }

      return { success: true, migratedCount }
    } catch (error) {
      console.error('Error migrating local documents:', error)
      return { success: false, migratedCount: 0 }
    }
  }

  return {
    saveTextFile,
    loadTextFile,
    loadFileList,
    deleteTextFile,
    renameTextFile,
    migrateLocalDocuments
  }
}
