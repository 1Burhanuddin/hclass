/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as assignments from "../assignments.js";
import type * as attendance from "../attendance.js";
import type * as batchSubjects from "../batchSubjects.js";
import type * as batches from "../batches.js";
import type * as cleanupDuplicateUsers from "../cleanupDuplicateUsers.js";
import type * as fees from "../fees.js";
import type * as grades from "../grades.js";
import type * as notifications from "../notifications.js";
import type * as predefinedSubjects from "../predefinedSubjects.js";
import type * as studentAnalytics from "../studentAnalytics.js";
import type * as students from "../students.js";
import type * as subjects from "../subjects.js";
import type * as teachers from "../teachers.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  assignments: typeof assignments;
  attendance: typeof attendance;
  batchSubjects: typeof batchSubjects;
  batches: typeof batches;
  cleanupDuplicateUsers: typeof cleanupDuplicateUsers;
  fees: typeof fees;
  grades: typeof grades;
  notifications: typeof notifications;
  predefinedSubjects: typeof predefinedSubjects;
  studentAnalytics: typeof studentAnalytics;
  students: typeof students;
  subjects: typeof subjects;
  teachers: typeof teachers;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
