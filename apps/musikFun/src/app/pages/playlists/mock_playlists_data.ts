export enum CurrentUserReaction {
  None = 0,
  Like = 1,
  Dislike = -1,
}

export type Playlist = {
  id: string;
  type: 'playlists';
  attributes: PlaylistAttributes;
};

type Tag = {
  id: string;
  name: string;
};

export type PlaylistAttributes = {
  title: string;
  description: string;
  addedAt: string;
  updatedAt: string;
  order: number;
  tags: Tag[];
  images: Images;
  user: User;
  // likes
  currentUserReaction: CurrentUserReaction;
  dislikesCount: number;
  likesCount: number;
};

// Response
export type PlaylistsResponse = {
  data: Playlist[];
  meta: Meta;
};

// Arguments
export type CreatePlaylistArgs = Pick<
  PlaylistAttributes,
  'title' | 'description'
>;

export type UpdatePlaylistArgs = Partial<
  Pick<PlaylistAttributes, 'title' | 'description'>
> & {
  tagIds: string[];
};

export type FetchPlaylistsArgs = {
  pageSize?: number;
  pageNumber?: number;
  search?: string;
  sortBy?: 'addedAt' | 'likesCount';
  sortDirection?: 'asc' | 'desc';
  tagsIds?: string[]; // e.g.: tagsIds=tag1&tagsIds=tag2
  userId?: string;
  trackId?: string;
};

export type ExtensionsError = {
  data: {
    extensions?: { key?: string; message?: string }[];
  };
};

export type Images = {
  main: Cover[];
};

export type Meta = {
  page: number;
  pageSize: number;
  totalCount: number;
  pagesCount: number;
};

export type Cover = {
  type: ImageType;
  width: number;
  height: number;
  fileSize: number;
  url: string;
};

export enum ImageType {
  ORIGINAL = 'original',
  MEDIUM = 'medium',
  THUMBNAIL = 'thumbnail',
}

export type User = {
  id: string;
  name: string;
};

export type ReactionResponse = {
  objectId: string;
  value: number;
  likes: number;
  dislikes: number;
};

export const MOCK_PLAYLISTS_RESPONSE: PlaylistsResponse = {
  data: [
    {
      id: 'pl_001',
      type: 'playlists',
      attributes: {
        title: 'Утренний Чилл',
        description: 'Нежные треки для спокойного начала дня',
        addedAt: '2025-08-10T08:00:00.000Z',
        updatedAt: '2025-09-10T08:00:00.000Z',
        order: 1,
        tags: [
          { id: 'tag_chill', name: 'chill' },
          { id: 'tag_lofi', name: 'lofi' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1011/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1011/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1011/600/600',
            },
          ],
        },
        user: { id: 'u_1', name: 'AI Mix' },
        currentUserReaction: CurrentUserReaction.Like,
        dislikesCount: 2,
        likesCount: 154,
      },
    },
    {
      id: 'pl_002',
      type: 'playlists',
      attributes: {
        title: 'Фокус и Работа',
        description: 'Инструментальная подборка для концентрации',
        addedAt: '2025-08-20T12:00:00.000Z',
        updatedAt: '2025-09-05T09:40:00.000Z',
        order: 2,
        tags: [
          { id: 'tag_focus', name: 'focus' },
          { id: 'tag_ambient', name: 'ambient' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1027/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1027/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1027/600/600',
            },
          ],
        },
        user: { id: 'u_2', name: 'Deep Focus' },
        currentUserReaction: CurrentUserReaction.None,
        dislikesCount: 0,
        likesCount: 98,
      },
    },
    {
      id: 'pl_003',
      type: 'playlists',
      attributes: {
        title: 'Энергия Спорта',
        description: 'Басы и драйв для тренировок',
        addedAt: '2025-08-15T17:00:00.000Z',
        updatedAt: '2025-09-10T19:00:00.000Z',
        order: 3,
        tags: [
          { id: 'tag_edm', name: 'edm' },
          { id: 'tag_workout', name: 'workout' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/103/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/103/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/103/600/600',
            },
          ],
        },
        user: { id: 'u_3', name: 'Gym Beats' },
        currentUserReaction: CurrentUserReaction.Like,
        dislikesCount: 5,
        likesCount: 321,
      },
    },
    {
      id: 'pl_004',
      type: 'playlists',
      attributes: {
        title: 'Русский Инди',
        description: 'Новые имена и редкости инди-сцены',
        addedAt: '2025-07-28T13:20:00.000Z',
        updatedAt: '2025-08-29T11:10:00.000Z',
        order: 4,
        tags: [
          { id: 'tag_indie', name: 'indie' },
          { id: 'tag_ru', name: 'ru' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1042/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1042/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1042/600/600',
            },
          ],
        },
        user: { id: 'u_4', name: 'Indie Room' },
        currentUserReaction: CurrentUserReaction.None,
        dislikesCount: 1,
        likesCount: 77,
      },
    },
    {
      id: 'pl_005',
      type: 'playlists',
      attributes: {
        title: 'Ночное Движение',
        description: 'Лёгкий хаус и диско на вечер',
        addedAt: '2025-09-02T20:30:00.000Z',
        updatedAt: '2025-09-10T23:10:00.000Z',
        order: 5,
        tags: [
          { id: 'tag_house', name: 'house' },
          { id: 'tag_disco', name: 'disco' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1050/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1050/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1050/600/600',
            },
          ],
        },
        user: { id: 'u_5', name: 'Late Night' },
        currentUserReaction: CurrentUserReaction.Like,
        dislikesCount: 0,
        likesCount: 205,
      },
    },
    {
      id: 'pl_006',
      type: 'playlists',
      attributes: {
        title: 'Джазовый Лоундж',
        description: 'Мягкий джаз и немного соула',
        addedAt: '2025-06-10T19:00:00.000Z',
        updatedAt: '2025-06-14T20:40:40.000Z',
        order: 6,
        tags: [
          { id: 'tag_jazz', name: 'jazz' },
          { id: 'tag_soul', name: 'soul' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1062/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1062/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1062/600/600',
            },
          ],
        },
        user: { id: 'u_6', name: 'Blue Note' },
        currentUserReaction: CurrentUserReaction.None,
        dislikesCount: 3,
        likesCount: 120,
      },
    },
    {
      id: 'pl_007',
      type: 'playlists',
      attributes: {
        title: 'Ретро Вайб',
        description: 'Хиты 80-х и 90-х',
        addedAt: '2025-08-01T09:00:00.000Z',
        updatedAt: '2025-08-05T10:05:05.000Z',
        order: 7,
        tags: [
          { id: 'tag_retro', name: 'retro' },
          { id: 'tag_90s', name: '90s' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1074/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1074/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1074/600/600',
            },
          ],
        },
        user: { id: 'u_7', name: 'Time Machine' },
        currentUserReaction: CurrentUserReaction.Like,
        dislikesCount: 4,
        likesCount: 412,
      },
    },
    {
      id: 'pl_008',
      type: 'playlists',
      attributes: {
        title: 'Акустический День',
        description: 'Гитары, голоса и воздух',
        addedAt: '2025-09-01T07:20:00.000Z',
        updatedAt: '2025-09-02T07:30:00.000Z',
        order: 8,
        tags: [
          { id: 'tag_acoustic', name: 'acoustic' },
          { id: 'tag_folk', name: 'folk' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1080/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1080/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1080/600/600',
            },
          ],
        },
        user: { id: 'u_8', name: 'Acoustic Lab' },
        currentUserReaction: CurrentUserReaction.None,
        dislikesCount: 1,
        likesCount: 65,
      },
    },
    {
      id: 'pl_009',
      type: 'playlists',
      attributes: {
        title: 'Хип-Хоп Марафон',
        description: 'Новые и классические релизы',
        addedAt: '2025-08-12T15:00:00.000Z',
        updatedAt: '2025-08-18T16:20:00.000Z',
        order: 9,
        tags: [
          { id: 'tag_hiphop', name: 'hip-hop' },
          { id: 'tag_trap', name: 'trap' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/1084/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/1084/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/1084/600/600',
            },
          ],
        },
        user: { id: 'u_9', name: 'Urban Flow' },
        currentUserReaction: CurrentUserReaction.Like,
        dislikesCount: 7,
        likesCount: 513,
      },
    },
    {
      id: 'pl_010',
      type: 'playlists',
      attributes: {
        title: 'Кино и Сериалы',
        description: 'Саундтреки, которые хочется переслушивать',
        addedAt: '2025-09-08T18:00:00.000Z',
        updatedAt: '2025-09-12T19:00:00.000Z',
        order: 10,
        tags: [
          { id: 'tag_soundtrack', name: 'soundtrack' },
          { id: 'tag_score', name: 'score' },
        ],
        images: {
          main: [
            {
              type: ImageType.THUMBNAIL,
              width: 150,
              height: 150,
              fileSize: 10240,
              url: 'https://picsum.photos/id/109/150/150',
            },
            {
              type: ImageType.MEDIUM,
              width: 300,
              height: 300,
              fileSize: 20480,
              url: 'https://picsum.photos/id/109/300/300',
            },
            {
              type: ImageType.ORIGINAL,
              width: 600,
              height: 600,
              fileSize: 40960,
              url: 'https://picsum.photos/id/109/600/600',
            },
          ],
        },
        user: { id: 'u_10', name: 'Screen Scores' },
        currentUserReaction: CurrentUserReaction.None,
        dislikesCount: 0,
        likesCount: 142,
      },
    },
  ],
  meta: {
    page: 1,
    pageSize: 10,
    totalCount: 10,
    pagesCount: 1,
  },
};
