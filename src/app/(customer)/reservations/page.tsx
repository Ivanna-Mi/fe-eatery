"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  CalendarDays,
  Clock,
  Users,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { reservationsApi } from "@/lib/api";
import type { ApiReservation } from "@/lib/api/types";

type Reservation = ApiReservation;

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  confirmed: "bg-green-500/10 text-green-600 border-green-200",
  completed: "bg-blue-500/10 text-blue-600 border-blue-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
};

const statusBorderColors = {
  pending: "border-l-yellow-400",
  confirmed: "border-l-green-400",
  completed: "border-l-blue-400",
  cancelled: "border-l-red-400",
};

export default function ReservationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const apiUser = useAuthStore((state) => state.user);
  const apiPortal = useAuthStore((state) => state.portal);
  const apiAccessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn =
    status === "authenticated" ||
    Boolean(apiUser && apiPortal === "customer" && apiAccessToken);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationsApi.listMyReservations();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchReservations();
    }
  }, [isLoggedIn, router, fetchReservations]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
              My Reservations
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              View and manage your cafe table reservations
            </p>
          </div>
          <Link href="/reservations/new" className="w-full sm:w-auto">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              New Reservation
            </Button>
          </Link>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div variants={itemVariants}>
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">
                    {error}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchReservations}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div variants={itemVariants} className="flex justify-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && reservations.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Reservations Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Make your first table reservation and enjoy your cafe
                  experience
                </p>
                <Link href="/reservations/new">
                  <Button>Create Reservation</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reservations List */}
        {!loading && !error && reservations.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            {reservations.map((reservation) => (
              <Link
                key={reservation.id}
                href={`/reservations/${reservation.id}`}
                className="block"
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-l-4 bg-card",
                    statusBorderColors[
                      reservation.status as keyof typeof statusBorderColors
                    ],
                  )}
                >
                  <CardContent className="p-4 sm:p-6">
                    {/* Status row: always its own line so it never competes for space */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Table #
                        {reservation.table?.table_number ??
                          reservation.table_id}
                        <span className="font-normal">
                          {" · "}
                          {reservation.table?.capacity != null
                            ? `${reservation.table.capacity} seats`
                            : "—"}
                        </span>
                      </p>
                      <span
                        className={cn(
                          "shrink-0 px-3 py-1 rounded-full text-xs font-medium border",
                          statusColors[
                            reservation.status as keyof typeof statusColors
                          ],
                        )}
                      >
                        {reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)}
                      </span>
                    </div>

                    {/* Meta row: wraps instead of overflowing on narrow screens */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{reservation.reservation_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{reservation.reservation_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{reservation.guest_count} guests</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
