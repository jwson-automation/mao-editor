export type Locale = 'ko' | 'en' | 'ja'

const translations = {
  ko: {
    savedDocuments: '저장된 문서',
    exportAll: 'Export',
    importAll: 'Import',
    newDocument: 'New',
    noDocuments: '저장된 문서가 없습니다',
    edit: '수정',
    editTitle: '제목 수정',
    save: '저장',
    cancel: '취소',
    apply: '적용',
    delete: '삭제',
    deleteConfirm: '정말로 삭제하시겠습니까?',
    deleteFailed: '삭제에 실패했습니다.',
    saved: '저장되었습니다!',
    saveFailed: '저장에 실패했습니다.',
    downloaded: '파일이 다운로드되었습니다!',
    exportFailed: '파일 저장에 실패했습니다.',
    invalidFormat: '올바른 형식의 파일이 아닙니다.',
    imported: (count: number) => `${count}개의 파일을 불러왔습니다!`,
    importFailed: '파일 불러오기에 실패했습니다.',
    inputPlaceholder: '텍스트를 입력하거나 붙여넣으세요...',
    editPlaceholder: '텍스트를 수정하세요...',
    toggleVisibility: '가리기 표시 전환',
    justNow: '방금 전',
    minutesAgo: (n: number) => `${n}분 전`,
    hoursAgo: (n: number) => `${n}시간 전`,
    daysAgo: (n: number) => `${n}일 전`,
    login: '로그인',
    logout: '로그아웃',
    signup: '회원가입',
    username: '아이디',
    password: '비밀번호',
    usernamePlaceholder: '1-20자',
    passwordPlaceholder: '4자리 이상',
    alreadyHaveAccount: '이미 계정이 있으신가요? 로그인',
    needAccount: '계정이 필요하신가요? 회원가입',
    loading: '로딩 중...',
    migrateDocumentsTitle: '로컬 문서 발견',
    migrateDocumentsMessage: (count: number) => `이미 이 브라우저에서 작업 중인 문서가 ${count}개 있습니다. 계정에 추가하시겠습니까?`,
    migrateDocumentsConfirm: '추가',
    migrateDocumentsSkip: '건너뛰기',
    migratedSuccess: (count: number) => `${count}개의 문서가 추가되었습니다!`
  },
  en: {
    savedDocuments: 'Saved Documents',
    exportAll: 'Export',
    importAll: 'Import',
    newDocument: 'New',
    noDocuments: 'No saved documents',
    edit: 'Edit',
    editTitle: 'Edit Title',
    save: 'Save',
    cancel: 'Cancel',
    apply: 'Apply',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete?',
    deleteFailed: 'Failed to delete.',
    saved: 'Saved!',
    saveFailed: 'Failed to save.',
    downloaded: 'File downloaded!',
    exportFailed: 'Failed to export files.',
    invalidFormat: 'Invalid file format.',
    imported: (count: number) => `${count} file(s) imported!`,
    importFailed: 'Failed to import files.',
    inputPlaceholder: 'Enter or paste text...',
    editPlaceholder: 'Edit text...',
    toggleVisibility: 'Toggle Hidden Text Display',
    justNow: 'just now',
    minutesAgo: (n: number) => `${n}m ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    daysAgo: (n: number) => `${n}d ago`,
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: '1-20 characters',
    passwordPlaceholder: '4+ digits',
    alreadyHaveAccount: 'Already have an account? Login',
    needAccount: 'Need an account? Sign Up',
    loading: 'Loading...',
    migrateDocumentsTitle: 'Local Documents Found',
    migrateDocumentsMessage: (count: number) => `You have ${count} document(s) in this browser. Add them to your account?`,
    migrateDocumentsConfirm: 'Add',
    migrateDocumentsSkip: 'Skip',
    migratedSuccess: (count: number) => `${count} document(s) added!`
  },
  ja: {
    savedDocuments: '保存された文書',
    exportAll: 'Export',
    importAll: 'Import',
    newDocument: 'New',
    noDocuments: '保存された文書がありません',
    edit: '編集',
    editTitle: 'タイトル編集',
    save: '保存',
    cancel: 'キャンセル',
    apply: '適用',
    delete: '削除',
    deleteConfirm: '本当に削除しますか？',
    deleteFailed: '削除に失敗しました。',
    saved: '保存しました！',
    saveFailed: '保存に失敗しました。',
    downloaded: 'ファイルをダウンロードしました！',
    exportFailed: 'ファイル保存に失敗しました。',
    invalidFormat: '正しい形式のファイルではありません。',
    imported: (count: number) => `${count}個のファイルを読み込みました！`,
    importFailed: 'ファイルの読み込みに失敗しました。',
    inputPlaceholder: 'テキストを入力または貼り付け...',
    editPlaceholder: 'テキストを編集...',
    toggleVisibility: '隠しテキスト表示の切り替え',
    justNow: 'たった今',
    minutesAgo: (n: number) => `${n}分前`,
    hoursAgo: (n: number) => `${n}時間前`,
    daysAgo: (n: number) => `${n}日前`,
    login: 'ログイン',
    logout: 'ログアウト',
    signup: '新規登録',
    username: 'ユーザー名',
    password: 'パスワード',
    usernamePlaceholder: '1-20文字',
    passwordPlaceholder: '4桁以上',
    alreadyHaveAccount: 'アカウントをお持ちですか？ログイン',
    needAccount: 'アカウントが必要ですか？新規登録',
    loading: '読み込み中...',
    migrateDocumentsTitle: 'ローカル文書を発見',
    migrateDocumentsMessage: (count: number) => `このブラウザで作業中の文書が${count}個あります。アカウントに追加しますか？`,
    migrateDocumentsConfirm: '追加',
    migrateDocumentsSkip: 'スキップ',
    migratedSuccess: (count: number) => `${count}個の文書が追加されました！`
  }
}

export function useI18n() {
  const locale = useState<Locale>('locale', () => {
    // URL에서 lang 파라미터 읽기
    if (import.meta.client) {
      const params = new URLSearchParams(window.location.search)
      const lang = params.get('lang') as Locale
      if (lang && ['ko', 'en', 'ja'].includes(lang)) {
        return lang
      }
    }
    return 'en'
  })

  const t = computed(() => translations[locale.value])

  function setLocale(newLocale: Locale) {
    locale.value = newLocale
    // URL 업데이트
    if (import.meta.client) {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', newLocale)
      window.history.replaceState({}, '', url)
    }
  }

  return {
    locale,
    t,
    setLocale
  }
}
