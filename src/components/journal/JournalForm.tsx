import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSurahByNumber } from '#/lib/quran/surahs'
import {
  createJournalEntrySchema,
  type CreateJournalEntryInput,
} from '#/lib/validators/journal'
import {
  createJournalEntry,
  updateJournalEntry,
} from '#/server/functions/journal'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { SurahSelector } from './SurahSelector'
import { AyahRangeInput } from './AyahRangeInput'
import { MoodSelector } from './MoodSelector'
import { TagInput } from './TagInput'

interface JournalFormProps {
  /** Pass existing entry to enable edit mode */
  defaultValues?: Partial<CreateJournalEntryInput> & { id?: string }
}

export function JournalForm({ defaultValues }: JournalFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { getToken } = useAuth()
  const isEdit = !!defaultValues?.id

  const createFn = useServerFn(createJournalEntry)
  const updateFn = useServerFn(updateJournalEntry)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateJournalEntryInput>({
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues: {
      surahNumber: defaultValues?.surahNumber ?? undefined,
      surahName:
        defaultValues?.surahName ||
        (defaultValues?.surahNumber
          ? (getSurahByNumber(defaultValues.surahNumber)
              ?.nameTransliteration ?? '')
          : ''),
      ayahStart: defaultValues?.ayahStart ?? null,
      ayahEnd: defaultValues?.ayahEnd ?? null,
      reflection: defaultValues?.reflection ?? '',
      mood: defaultValues?.mood ?? null,
      tags: defaultValues?.tags ?? '',
      date: defaultValues?.date ?? new Date().toISOString().split('T')[0],
    },
  })

  const surahNumber = watch('surahNumber')
  const mood = watch('mood')
  const tags = watch('tags')
  const selectedSurah = surahNumber ? getSurahByNumber(surahNumber) : undefined

  const mutation = useMutation({
    mutationFn: async (data: CreateJournalEntryInput) => {
      const clerkToken = (await getToken()) ?? ''
      if (isEdit) {
        return updateFn({
          data: { clerkToken, id: defaultValues!.id!, data },
        })
      }
      return createFn({ data: { ...data, clerkToken } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] })
      navigate({ to: '/journal' })
    },
  })

  const onSubmit = handleSubmit((data) => mutation.mutateAsync(data))

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Surah */}
      <div>
        <Label className="mb-1.5 block text-[var(--foreground)]">Surah</Label>
        <SurahSelector
          value={surahNumber}
          onChange={(num, name) => {
            setValue('surahNumber', num, { shouldValidate: true })
            setValue('surahName', name)
            // Reset ayah range when surah changes
            setValue('ayahStart', null)
            setValue('ayahEnd', null)
          }}
        />
        {errors.surahNumber && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            Sila pilih surah
          </p>
        )}
      </div>

      {/* Ayah range — only show if surah is selected */}
      {selectedSurah && (
        <div>
          <AyahRangeInput
            ayahStart={watch('ayahStart')}
            ayahEnd={watch('ayahEnd')}
            maxAyah={selectedSurah.ayahCount}
            onStartChange={(v) => setValue('ayahStart', v)}
            onEndChange={(v) => setValue('ayahEnd', v)}
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Pilihan — {selectedSurah.nameTransliteration} ada{' '}
            {selectedSurah.ayahCount} ayat
          </p>
        </div>
      )}

      {/* Reflection */}
      <div>
        <Label className="mb-1.5 block text-[var(--foreground)]">
          Refleksi / Pengajaran
        </Label>
        <Textarea
          {...register('reflection')}
          placeholder="Apa yang anda pelajari hari ini..."
          rows={6}
        />
        {errors.reflection && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.reflection.message}
          </p>
        )}
      </div>

      {/* Mood */}
      <div>
        <Label className="mb-1.5 block text-[var(--foreground)]">
          Perasaan
        </Label>
        <MoodSelector
          value={mood}
          onChange={(v) => setValue('mood', v as any)}
        />
      </div>

      {/* Tags */}
      <div>
        <Label className="mb-1.5 block text-[var(--foreground)]">Tags</Label>
        <TagInput
          value={tags ?? ''}
          onChange={(v) => setValue('tags', v)}
        />
      </div>

      {/* Date */}
      <div>
        <Label className="mb-1.5 block text-[var(--foreground)]">Tarikh</Label>
        <Input type="date" {...register('date')} />
        {errors.date && (
          <p className="mt-1 text-xs text-[var(--destructive)]">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Error */}
      {mutation.error && (
        <p className="text-sm text-[var(--destructive)]">
          {mutation.error.message}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Menyimpan...'
            : isEdit
              ? 'Kemaskini Catatan'
              : 'Simpan Catatan'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/journal' })}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
