// schemas/workout.js
import {defineType, defineField, defineArrayMember, isTitledListValue} from 'sanity'
import React from 'react'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  icon: () => '💪', // Emoji as icon
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: "Clerk's user ID",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'workout Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'total duration of workout in seconds',
      type: 'number',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'exercises',
      title: 'Workout Exercises',
      description: 'the exercises performed in this workout with sets reps and weight.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'Wotkout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'the exercise that was performed',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'sets',
              title: 'Sets',
              description: 'The sets performed for this exercise with reps weight and weight unit',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'set',
                  title: 'Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Reps',
                      description: 'number of reps performed in this set',
                      type: 'number',
                      validation: (rule) => rule.required().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      description: 'The weight used for this set',
                      type: 'number',
                      validation: (rule) => rule.required().min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight unit',
                      description: 'the unit of weight in kg or pounds',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Ponuds(lbs)', value: 'lbs'},
                          {title: 'Kilograms(kgs)', value: 'kg'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'kg',
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare({reps, weight, weightUnit}) {
                      return {
                        title: `Set: ${reps} reps`,
                        subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight',
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets',
            },
            prepare(selection: {title?: string; sets?: any[]}) {
              const {title, sets} = selection
              const setCount = sets ? sets.length : 0
              return {
                title: title || 'Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({date, duration, exercises}) {
      const workoutDate = date ? new Date(date).toLocaleDateString() : 'No Date'
      const durationMinutes = duration ? Math.round(duration / 60) : 0
      const exerciseCount = exercises ? exercises.length : 0

      return {
        title: `Workout - ${workoutDate}`,
        subtitle: `${durationMinutes} min . ${exerciseCount} exercises${exerciseCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
