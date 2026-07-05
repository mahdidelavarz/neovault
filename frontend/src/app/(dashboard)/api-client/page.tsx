"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCollections,
  useEndpoints,
  useCreateEndpoint,
  useUpdateEndpoint,
  useDeleteEndpoint,
  useTestEndpoint,
  useEnvironments,
} from "@/features/postman/hooks/useApiClient";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/http";
import {
  type ApiEndpoint,
  type HttpMethod,
  type KeyValue,
  type Environment,
  type AuthType,
  type AuthData,
  HTTP_METHODS,
} from "@/features/postman/types/apiClient";
import { useVault } from "@/features/settings/security/hooks/useVault";
import { type Infrastructure } from "@/features/infrastructure/types/infrastructure";
import { type RequestSnapshot } from "@/features/postman/utils/apiCodegen";
import CollectionSidebar from "@/features/postman/components/CollectionSidebar";
import RequestBuilder from "@/features/postman/components/RequestBuilder";
import ResponseViewer from "@/features/postman/components/ResponseViewer";
import EnvironmentModal from "@/features/postman/components/EnvironmentModal";
import ImportCurlModal, {
  type ParsedCurl,
} from "@/features/postman/components/ImportCurlModal";
import Button from "@/features/shared/ui/Button";
import Modal from "@/features/shared/ui/Modal";
import BottomSheet from "@/features/shared/ui/BottomSheet";
import { useIsMobile } from "@/features/shared/hooks/useIsMobile";
import Input from "@/features/shared/ui/Input";
import Textarea from "@/features/shared/ui/TextArea";
import Alert from "@/features/shared/ui/Alert";
import TagSelector from "@/features/tags/components/TagSelector";
import {
  LucideFolder, LucideType, LucidePanelLeft, LucideLayers, LucideMoreHorizontal,
  LucidePlus, LucideClock3, LucideX, LucideSend, LucideInbox, LucideCheck,
  LucideStar, LucideChevronDown, LucideSettings2, LucideSave, LucideBookmarkPlus,
  LucideTerminal, LucideTrash2,
} from "@/Icons/Icons";
import FormLayout from "@/features/shared/layout/FormLayout";
import FormSelect from "@/features/snippets/components/FormSelect";

// ─── Save form schema ─────────────────────────────────────────────────────────
const saveSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  collectionId: z.number().optional(),
  categoryId: z.number().optional(),
  tagIds: z.array(z.number()),
  isFavorite: z.boolean(),
});
type SaveFormData = z.infer<typeof saveSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApiClientPage() {
  // Sidebar state
  const [selectedCollection, setSelectedCollection] = useState<number | null>(
    null,
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Request state
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    null,
  );
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState<"json" | "raw" | "form-data">(
    "json",
  );

  // Response
  const [response, setResponse] = useState<any>(null);

  // Save modal
  const [saveOpen, setSaveOpen] = useState(false);

  // Confirm delete
  const [confirmDel, setConfirmDel] = useState(false);

  // Import from cURL (P5-8 A-3)
  const [importCurlOpen, setImportCurlOpen] = useState(false);

  // Saved example response (P5-8 A-2)
  const [isExampleResponse, setIsExampleResponse] = useState(false);

  // Query params (P3-15)
  const [queryParams, setQueryParams] = useState<KeyValue[]>([]);

  // Environment
  const [activeEnvId, setActiveEnvId] = useState<number | null>(null);
  const [envModalOpen, setEnvModalOpen] = useState(false);

  // Mobile actions bottom sheet (secondary actions: save / import / env / delete)
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  // Auth
  const [authType, setAuthType] = useState<AuthType>("none");
  const [authData, setAuthData] = useState<Partial<AuthData>>({});

  const {
    isEnabled: vaultEnabled,
    isUnlocked: vaultUnlocked,
    encrypt,
    decrypt,
  } = useVault();

  // Draft restore notice (P3-14)
  const [draftRestored, setDraftRestored] = useState(false);

  // Mobile tab switcher (Option B)
  const [mobileTab, setMobileTab] = useState<"request" | "response">("request");

  // P3-17: resizable splitter
  const [splitPx, setSplitPx] = useState(400);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleSplitterDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = splitPx;
      const onMove = (ev: MouseEvent) => {
        const rightH = rightRef.current?.clientHeight ?? 0;
        const delta = ev.clientY - startY;
        setSplitPx(Math.max(200, Math.min(rightH - 160, startH + delta)));
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [splitPx],
  );

  const { data: environments } = useEnvironments();
  const { data: infraEnvItems } = useQuery<Infrastructure[]>({
    queryKey: ["infra-env-items"],
    queryFn: async () => {
      const { data } = await api.get("/infrastructure", {
        params: { infraType: "env", limit: 100 },
      });
      return data.items as Infrastructure[];
    },
  });
  const { data: collections } = useCollections();
  const { data: categories } = useCategories();
  const { data: endpoints, refetch } = useEndpoints({
    collectionId: selectedCollection || undefined,
  });
  const createEndpoint = useCreateEndpoint();
  const updateEndpoint = useUpdateEndpoint();
  const deleteEndpoint = useDeleteEndpoint();
  const testEndpoint = useTestEndpoint();

  // ─── P3-14: localStorage draft ──────────────────────────────────────────────
  const DRAFT_KEY = "linkvault:api-draft";

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (!d.url) return;
      setMethod(d.method ?? "GET");
      setUrl(d.url);
      setHeaders(d.headers ?? "");
      setBody(d.body ?? "");
      setBodyType(d.bodyType ?? "json");
      setQueryParams(
        (d.queryParams ?? []).map((p: any) => ({
          ...p,
          id: p.id ?? crypto.randomUUID(),
        })),
      );
      setDraftRestored(true);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-dismiss draft notice after 4 s
  useEffect(() => {
    if (!draftRestored) return;
    const t = setTimeout(() => setDraftRestored(false), 4000);
    return () => clearTimeout(t);
  }, [draftRestored]);

  // Persist draft on every change
  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ method, url, headers, body, bodyType, queryParams }),
    );
  }, [method, url, headers, body, bodyType, queryParams]);

  // Auto-switch to response tab on mobile when response arrives
  useEffect(() => {
    if (response && isMobile) {
      setMobileTab("response");
    }
  }, [response, isMobile]);

  // ─── P3-15: URL ↔ params bidirectional sync ──────────────────────────────────

  // Parse query string from a raw URL string into KeyValue rows
  const parseUrlParams = (
    rawUrl: string,
    existing: KeyValue[] = [],
  ): KeyValue[] => {
    const idx = rawUrl.indexOf("?");
    if (idx === -1) return [];
    return rawUrl
      .slice(idx + 1)
      .split("&")
      .filter(Boolean)
      .map((pair) => {
        const eqIdx = pair.indexOf("=");
        const key = decodeURIComponent(
          eqIdx === -1 ? pair : pair.slice(0, eqIdx),
        );
        const value =
          eqIdx === -1 ? "" : decodeURIComponent(pair.slice(eqIdx + 1));
        const found = existing.find((p) => p.key === key);
        return {
          id: found?.id ?? crypto.randomUUID(),
          key,
          value,
          enabled: found?.enabled ?? true,
        };
      });
  };

  // Rebuild the URL from a base URL + enabled params
  const buildUrl = (base: string, params: KeyValue[]): string => {
    const enabled = params.filter((p) => p.key.trim() && p.enabled);
    if (!enabled.length) return base;
    const qs = enabled
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");
    return `${base}?${qs}`;
  };

  // URL bar changed by user → re-parse params from it
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setQueryParams(parseUrlParams(newUrl, queryParams));
  };

  // Params table changed → rebuild URL
  const handleParamsChange = (newParams: KeyValue[]) => {
    setQueryParams(newParams);
    const base = url.includes("?") ? url.slice(0, url.indexOf("?")) : url;
    setUrl(buildUrl(base, newParams));
  };

  // ─── Save form ──────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SaveFormData>({
    resolver: zodResolver(saveSchema),
    defaultValues: {
      title: "",
      description: "",
      tagIds: [],
      isFavorite: false,
    },
  });

  const openSave = () => {
    if (selectedEndpoint) {
      reset({
        title: selectedEndpoint.title,
        description: selectedEndpoint.description ?? "",
        collectionId: selectedEndpoint.collectionId,
        categoryId: selectedEndpoint.categoryId,
        tagIds: selectedEndpoint.tags?.map((t: any) => t.id) ?? [],
        isFavorite: selectedEndpoint.isFavorite,
      });
    } else {
      reset({
        title: "",
        description: "",
        collectionId: selectedCollection ?? undefined,
        tagIds: [],
        isFavorite: false,
      });
    }
    setSaveOpen(true);
  };

  const onSave = async (data: SaveFormData) => {
    // Parse headers string → array
    const parsedHeaders = headers
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => {
        const [key, ...rest] = l.split(":");
        return {
          key: key?.trim() ?? "",
          value: rest.join(":").trim(),
          enabled: true,
        };
      })
      .filter((h) => h.key);

    const payload = {
      ...data,
      url,
      method,
      headers: parsedHeaders,
      queryParams: queryParams.filter((p) => p.key.trim()),
      body: body || undefined,
      bodyType: bodyType as any,
      authType,
      // P5-8 A-2: snapshot the last response as the saved example, if any
      exampleResponse: response ?? selectedEndpoint?.exampleResponse,
    };

    try {
      let savedId: number;
      if (selectedEndpoint) {
        await updateEndpoint.mutateAsync({
          id: selectedEndpoint.id,
          ...payload,
        });
        savedId = selectedEndpoint.id;
      } else {
        const created = await createEndpoint.mutateAsync(payload);
        savedId = (created as any).id;
      }
      // Encrypt authData to vault if credentials present
      if (vaultEnabled && vaultUnlocked && authType !== "none" && savedId) {
        const hasCredentials =
          authData.token ||
          authData.username ||
          authData.password ||
          authData.apiKey;
        if (hasCredentials) {
          await encrypt(
            "api_endpoint",
            String(savedId),
            "authData",
            JSON.stringify(authData),
          );
        }
      }
      setSaveOpen(false);
      refetch();
    } catch {
      /* shown via Alert */
    }
  };

  // ─── Infra → env injection ───────────────────────────────────────────────────
  const infraAsEnvs: Environment[] = (infraEnvItems ?? []).map((infra) => ({
    id: -infra.id,
    name: `[Infra] ${infra.title}`,
    userId: 0,
    createdAt: infra.createdAt,
    updatedAt: infra.updatedAt,
    variables: infra.content
      .split("\n")
      .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
      .map((line) => {
        const eq = line.indexOf("=");
        return {
          key: line.slice(0, eq).trim(),
          value: line.slice(eq + 1).trim(),
          enabled: true,
        };
      }),
  }));
  const allEnvironments = [...(environments ?? []), ...infraAsEnvs];

  // ─── Variable interpolation ──────────────────────────────────────────────────
  const activeEnv = allEnvironments.find((e) => e.id === activeEnvId) ?? null;
  const interpolateVars = (text: string): string => {
    if (!activeEnv?.variables?.length || !text) return text;
    return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const v = activeEnv.variables!.find(
        (v: any) => v.key === key.trim() && v.enabled,
      );
      return v ? v.value : match;
    });
  };

  // ─── Header resolution (shared by Send and Generate Code) ───────────────────
  const buildRequestHeaders = (
    resolvedHeaders: string,
  ): Record<string, string> => {
    let parsedHeaders: Record<string, string> = {};
    if (resolvedHeaders.trim()) {
      try {
        parsedHeaders = JSON.parse(resolvedHeaders);
      } catch {
        resolvedHeaders.split("\n").forEach((line) => {
          const [key, ...vals] = line.split(":");
          if (key && vals.length)
            parsedHeaders[key.trim()] = vals.join(":").trim();
        });
      }
    }
    // Apply auth headers client-side so credentials never touch the backend
    if (authType === "bearer" && authData.token) {
      parsedHeaders["Authorization"] = `Bearer ${authData.token}`;
    } else if (authType === "basic" && authData.username) {
      parsedHeaders["Authorization"] =
        `Basic ${btoa(`${authData.username}:${authData.password ?? ""}`)}`;
    } else if (authType === "api-key" && authData.apiKey) {
      parsedHeaders[authData.apiKeyHeader ?? "X-API-Key"] = authData.apiKey;
    }
    return parsedHeaders;
  };

  // ─── Send request ────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!url.trim()) return;
    setIsExampleResponse(false);
    try {
      const resolvedUrl = interpolateVars(url);
      const resolvedHeaders = interpolateVars(headers);
      const resolvedBody = interpolateVars(body);
      const parsedHeaders = buildRequestHeaders(resolvedHeaders);

      const result = await testEndpoint.mutateAsync({
        method,
        url: resolvedUrl,
        headers: parsedHeaders,
        body: resolvedBody || undefined,
        bodyType,
      });
      setResponse({ ...result, timestamp: new Date().toISOString() });
    } catch (err: any) {
      setResponse({
        status: 0,
        statusText: "Error",
        body: JSON.stringify({ error: err.message }, null, 2),
        headers: {},
        size: 0,
        time: 0,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // ─── Generate Code snapshot — current request, resolved like Send ───────────
  const requestSnapshot: RequestSnapshot | undefined = response
    ? {
        method,
        url: interpolateVars(url),
        headers: buildRequestHeaders(interpolateVars(headers)),
        body: interpolateVars(body) || undefined,
      }
    : undefined;

  // ─── Import from cURL (P5-8 A-3) ─────────────────────────────────────────────
  const handleImportCurl = (parsed: ParsedCurl) => {
    const importedMethod = (HTTP_METHODS as string[]).includes(parsed.method)
      ? (parsed.method as HttpMethod)
      : "GET";
    setMethod(importedMethod);
    setUrl(parsed.url);
    setQueryParams(parseUrlParams(parsed.url));
    setHeaders(
      Object.entries(parsed.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    );
    setBody(parsed.body);
    if (parsed.body) {
      try {
        JSON.parse(parsed.body);
        setBodyType("json");
      } catch {
        setBodyType("raw");
      }
    }
    setResponse(null);
    setIsExampleResponse(false);
  };

  // ─── Select endpoint ─────────────────────────────────────────────────────────
  const handleSelectEndpoint = async (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setMethod(ep.method as HttpMethod);
    setUrl(ep.url);
    setHeaders(
      ep.headers
        ?.filter((h) => h.enabled !== false)
        .map((h) => `${h.key}: ${h.value}`)
        .join("\n") ?? "",
    );
    setBody(ep.body ?? "");
    setBodyType((ep.bodyType as any) ?? "json");
    setQueryParams(
      (ep.queryParams ?? []).map((p) => ({
        ...p,
        id: (p as any).id ?? crypto.randomUUID(),
      })),
    );
    setDraftRestored(false);
    setMobileTab("request");
    // P5-8 A-2: show the saved example response until the user sends a live request
    setResponse(ep.exampleResponse ?? null);
    setIsExampleResponse(!!ep.exampleResponse);
    // Load auth
    setAuthType((ep.authType as AuthType) ?? "none");
    if (vaultEnabled && vaultUnlocked) {
      try {
        const raw = await decrypt("api_endpoint", String(ep.id), "authData");
        setAuthData(raw ? JSON.parse(raw) : (ep.authData ?? {}));
      } catch {
        setAuthData(ep.authData ?? {});
      }
    } else {
      setAuthData(ep.authData ?? {});
    }
  };

  const handleNewRequest = () => {
    setSelectedEndpoint(null);
    setMethod("GET");
    setUrl("");
    setHeaders("");
    setBody("");
    setBodyType("json");
    setQueryParams([]);
    setAuthType("none");
    setAuthData({});
    setDraftRestored(false);
    setMobileTab("request");
    setResponse(null);
    setIsExampleResponse(false);
  };

  const handleDelete = async () => {
    if (!selectedEndpoint) return;
    await deleteEndpoint.mutateAsync(selectedEndpoint.id);
    handleNewRequest();
    refetch();
    setConfirmDel(false);
  };

  const requestTitle = selectedEndpoint
    ? selectedEndpoint.title
    : "New Request";

  const pillColor = (status: number) => {
    if (status === 0 || status >= 500) return "var(--danger)";
    if (status < 300) return "var(--success)";
    if (status < 400) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="acp">
        {/* ── Mobile top bar ── */}
        <div className="acp-mobile-bar">
          <button
            className="acp-menu-btn"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open collections"
          >
            <LucidePanelLeft width={18} />
          </button>
          <span className="acp-mobile-title">API Client</span>
          {activeEnv && (
            <span
              className="acp-mobile-env"
              title={`Environment: ${activeEnv.name}`}
            >
              <LucideLayers width={11} />
              {activeEnv.name}
            </span>
          )}
          <button
            className="acp-actions-btn"
            onClick={() => setActionsSheetOpen(true)}
            aria-label="More actions"
          >
            <LucideMoreHorizontal width={18} />
          </button>
          <button
            className="acp-new-btn"
            onClick={handleNewRequest}
            aria-label="New request"
          >
            <LucidePlus width={18} />
          </button>
        </div>

        {/* ── Main layout ── */}
        <div className="acp-layout">
          {/* Sidebar */}
          <CollectionSidebar
            collections={collections}
            endpoints={endpoints}
            selectedCollection={selectedCollection}
            selectedEndpoint={selectedEndpoint}
            onSelectCollection={setSelectedCollection}
            onSelectEndpoint={handleSelectEndpoint}
            onNewRequest={handleNewRequest}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          {/* ── Right pane ── */}
          <div className="acp-right" ref={rightRef} data-mobile-tab={mobileTab}>
            {draftRestored && (
              <div className="acp-draft-notice">
                <LucideClock3 width={13} />
                Draft restored from your last session
                <button
                  className="acp-draft-dismiss"
                  onClick={() => setDraftRestored(false)}
                >
                  <LucideX width={12} />
                </button>
              </div>
            )}

            {/* ── Mobile tab bar (hidden on desktop) ── */}
            <div className="acp-mobile-tabs">
              <button
                className={[
                  "acp-mobile-tab",
                  mobileTab === "request" ? "acp-mobile-tab--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setMobileTab("request")}
              >
                <LucideSend width={14} />
                Request
              </button>
              <button
                className={[
                  "acp-mobile-tab",
                  mobileTab === "response" ? "acp-mobile-tab--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setMobileTab("response")}
              >
                <LucideInbox width={14} />
                Response
                {response && (
                  <span
                    className="acp-mobile-tab-badge"
                    style={{ color: pillColor(response.status) }}
                  >
                    {response.status}
                  </span>
                )}
              </button>
            </div>

            {/* Request section — fixed height, draggable */}
            <div className="acp-request-wrap" style={{ height: splitPx }}>
              <RequestBuilder
                method={method}
                url={url}
                headers={headers}
                body={body}
                bodyType={bodyType}
                isSaved={!!selectedEndpoint}
                isSending={testEndpoint.isPending}
                title={requestTitle}
                environments={allEnvironments}
                activeEnvId={activeEnvId}
                queryParams={queryParams}
                authType={authType}
                authData={authData}
                endpointId={selectedEndpoint?.id ?? null}
                onMethodChange={setMethod}
                onUrlChange={handleUrlChange}
                onHeadersChange={setHeaders}
                onBodyChange={setBody}
                onBodyTypeChange={setBodyType}
                onQueryParamsChange={handleParamsChange}
                onAuthTypeChange={setAuthType}
                onAuthDataChange={setAuthData}
                onSend={handleSend}
                onSave={openSave}
                onDelete={() => setConfirmDel(true)}
                onEnvChange={setActiveEnvId}
                onManageEnvs={() => setEnvModalOpen(true)}
                onImportCurl={() => setImportCurlOpen(true)}
              />
            </div>

            {/* Drag handle */}
            <div className="acp-splitter" onMouseDown={handleSplitterDown}>
              <div className="acp-splitter-dots" />
            </div>

            {/* Response section — fills remaining height */}
            <div className="acp-response-wrap">
              <ResponseViewer
                response={response}
                isLoading={testEndpoint.isPending}
                requestSnapshot={requestSnapshot}
                isExample={isExampleResponse}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Save / Update modal ── */}
      <Modal
        isOpen={saveOpen}
        onClose={() => setSaveOpen(false)}
        title={selectedEndpoint ? "Update Endpoint" : "Save Endpoint"}
        size="md"
      >
        <FormLayout
          compact
          onSubmit={handleSubmit(onSave)}
          noValidate
          footer={
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSaveOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={createEndpoint.isPending || updateEndpoint.isPending}
              >
                {selectedEndpoint ? "Update" : "Save Endpoint"}
              </Button>
            </>
          }
        >
          {(createEndpoint.isError || updateEndpoint.isError) && (
            <Alert
              type="error"
              message="Failed to save endpoint. Please try again."
            />
          )}

          <Input
            label="Title"
            leftIcon={LucideType}
            placeholder="e.g., Get User Profile"
            error={errors.title?.message}
            autoFocus
            {...register("title")}
          />

          <Textarea
            label="Description"
            placeholder="What does this endpoint do?"
            optional
            rows={2}
            {...register("description")}
          />

          <div className="save-form-grid">
            <FormSelect
              label="Collection"
              optional
              leftIcon={LucideFolder}
              {...register("collectionId", {
                setValueAs: (v) => (v ? parseInt(v) : undefined),
              })}
            >
              <option value="">No collection</option>
              {collections?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              label="Category"
              optional
              leftIcon={LucideFolder}
              {...register("categoryId", {
                setValueAs: (v) => (v ? parseInt(v) : undefined),
              })}
            >
              <option value="">No category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="save-form-field">
            <label className="save-form-label">
              Tags <span className="save-form-optional">optional</span>
            </label>
            <Controller
              name="tagIds"
              control={control}
              render={({ field }) => (
                <TagSelector
                  selectedTagIds={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <Controller
            name="isFavorite"
            control={control}
            render={({ field }) => (
              <label className="save-form-check">
                <div
                  className={[
                    "sf-check-box",
                    field.value ? "sf-check-box--on" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {field.value && <LucideCheck width={11} />}
                </div>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />
                <span className="save-form-check-label">
                  <LucideStar width={13} style={{ color: "#fbbf24" }} />
                  Mark as favorite
                </span>
              </label>
            )}
          />
        </FormLayout>
      </Modal>

      {/* ── Environment manager ── */}
      {envModalOpen && (
        <EnvironmentModal
          environments={environments ?? []}
          onClose={() => setEnvModalOpen(false)}
        />
      )}

      {/* ── Delete confirm ── */}
      <Modal
        isOpen={confirmDel}
        onClose={() => setConfirmDel(false)}
        title="Delete endpoint"
        size="sm"
      >
        <div className="del-confirm">
          <p className="del-confirm-text">
            Delete <strong>{selectedEndpoint?.title}</strong>? This cannot be
            undone.
          </p>
          <div className="del-confirm-actions">
            <Button variant="secondary" onClick={() => setConfirmDel(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteEndpoint.isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Import from cURL ── */}
      <ImportCurlModal
        isOpen={importCurlOpen}
        onClose={() => setImportCurlOpen(false)}
        onImport={handleImportCurl}
      />

      {/* ── Mobile actions sheet (secondary actions live here on mobile) ── */}
      <BottomSheet
        isOpen={actionsSheetOpen}
        onClose={() => setActionsSheetOpen(false)}
        title="Request actions"
      >
        <div className="acp-sheet">
          {/* Environment */}
          <div className="acp-sheet-section">
            <label className="acp-sheet-label">Environment</label>
            <div className="acp-sheet-env-row">
              <div className="acp-sheet-env-pill">
                <LucideLayers width={13} />
                <select
                  className="acp-sheet-env-select"
                  value={activeEnvId ?? ""}
                  onChange={(e) =>
                    setActiveEnvId(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                >
                  <option value="">No environment</option>
                  {allEnvironments.filter((e) => e.id > 0).length > 0 && (
                    <optgroup label="Environments">
                      {allEnvironments
                        .filter((e) => e.id > 0)
                        .map((env) => (
                          <option key={env.id} value={env.id}>
                            {env.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {allEnvironments.filter((e) => e.id < 0).length > 0 && (
                    <optgroup label="From Infrastructure">
                      {allEnvironments
                        .filter((e) => e.id < 0)
                        .map((env) => (
                          <option key={env.id} value={env.id}>
                            {env.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
                <LucideChevronDown width={12} />
              </div>
            </div>
            <button
              className="acp-sheet-item"
              onClick={() => {
                setActionsSheetOpen(false);
                setEnvModalOpen(true);
              }}
            >
              <LucideSettings2 width={16} />
              Manage environments
            </button>
          </div>

          <div className="acp-sheet-divider" />

          {/* Primary secondary-actions */}
          <button
            className="acp-sheet-item acp-sheet-item--accent"
            onClick={() => {
              setActionsSheetOpen(false);
              openSave();
            }}
          >
            {selectedEndpoint ? <LucideSave width={16} /> : <LucideBookmarkPlus width={16} />}
            {selectedEndpoint ? "Update" : "Save"}
          </button>
          <button
            className="acp-sheet-item"
            onClick={() => {
              setActionsSheetOpen(false);
              setImportCurlOpen(true);
            }}
          >
            <LucideTerminal width={16} />
            Import cURL
          </button>
          {selectedEndpoint && (
            <button
              className="acp-sheet-item acp-sheet-item--danger"
              onClick={() => {
                setActionsSheetOpen(false);
                setConfirmDel(true);
              }}
            >
              <LucideTrash2 width={16} />
              Delete endpoint
            </button>
          )}
        </div>
      </BottomSheet>
    </>
  );
}

const CSS = `
.acp { display: flex; flex-direction: column; height: 100%; gap: 0;  }

@media (max-width: 767px) {
.acp {padding : 10px;}
}

/* Mobile top bar */
.acp-mobile-bar {
  display:         none;
  align-items:     center;
  justify-content: space-between;
  gap:             8px;
  padding:         10px 16px;
  background:      var(--bg-surface);
  border:          1px solid var(--border-default);
  border-radius:   var(--radius-lg);
  margin-bottom:   12px;
  flex-shrink:     0;
}
@media (max-width: 767px) { .acp-mobile-bar { display: flex; } }
.acp-menu-btn, .acp-new-btn {
  display:         flex; align-items: center; justify-content: center;
  width:           36px; height: 36px;
  background:      transparent; border: 1px solid var(--border-default);
  border-radius:   var(--radius-md); color: var(--text-secondary); cursor: pointer;
  min-height:      44px; min-width: 44px;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.acp-actions-btn {
  display:         flex; align-items: center; justify-content: center;
  width:           36px; height: 36px;
  background:      transparent; border: 1px solid var(--border-default);
  border-radius:   var(--radius-md); color: var(--text-secondary); cursor: pointer;
  min-height:      44px; min-width: 44px;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.acp-menu-btn:hover, .acp-new-btn:hover, .acp-actions-btn:hover { background: var(--bg-overlay); color: var(--text-primary); }
.acp-new-btn { background: var(--accent-muted); border-color: var(--accent-border); color: var(--cyan-400); }
.acp-mobile-title { font-size: var(--text-md); font-weight: 600; color: var(--text-primary); margin-right: auto; }
.acp-mobile-env {
  display:       inline-flex; align-items: center; gap: 4px;
  max-width:     120px; padding: 2px 8px;
  background:    var(--accent-muted); border: 1px solid var(--accent-border);
  border-radius: 99px; color: var(--cyan-400);
  font-size:     var(--text-xs); font-weight: 500;
  white-space:   nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Mobile actions sheet content */
.acp-sheet         { display: flex; flex-direction: column; gap: 8px; }
.acp-sheet-section { display: flex; flex-direction: column; gap: 8px; }
.acp-sheet-label   { font-size: var(--text-xs); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; }
.acp-sheet-env-row { display: flex; }
.acp-sheet-env-pill {
  position:      relative;
  display:       flex; align-items: center; gap: 8px;
  flex:          1;
  height:        44px; padding: 0 12px;
  background:    var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-secondary);
}
.acp-sheet-env-pill:focus-within { border-color: var(--border-focus); }
.acp-sheet-env-select {
  flex:               1;
  background:         transparent; border: none; outline: none;
  color:              var(--text-primary);
  font-size:          var(--text-sm); font-family: var(--font-sans);
  appearance:         none; -webkit-appearance: none; cursor: pointer;
}
.acp-sheet-env-select option { background: var(--bg-elevated); color: var(--text-primary); }
.acp-sheet-divider { height: 1px; background: var(--border-subtle); margin: 4px 0; }
.acp-sheet-item {
  display:       flex; align-items: center; gap: 10px;
  width:         100%; min-height: 48px; padding: 0 14px;
  background:    transparent; border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-primary);
  font-size:     var(--text-sm); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; text-align: left;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.acp-sheet-item:hover { background: var(--bg-overlay); }
.acp-sheet-item--accent { background: var(--accent-muted); border-color: var(--accent-border); color: var(--cyan-300); }
.acp-sheet-item--accent:hover { background: var(--accent); color: white; }
.acp-sheet-item--danger { color: var(--danger); }
.acp-sheet-item--danger:hover { background: var(--danger-muted); border-color: rgba(239,68,68,0.3); }

/* Layout */
.acp-layout {
  display:    flex;
  gap:        12px;
  flex:       1;
  min-height: 0;
  overflow:   hidden;
}

/* Right pane */
.acp-right {
  flex:           1;
  display:        flex;
  flex-direction: column;
  min-width:      0;
  overflow:       hidden;
  gap:            0;
}

/* Request section wrapper — height controlled by JS */
.acp-request-wrap {
  flex-shrink: 0;
  min-height:  0;
  overflow:    hidden;
}
.acp-request-wrap > * { height: 100%; }

/* Drag handle */
.acp-splitter {
  flex-shrink:     0;
  height:          10px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          ns-resize;
  background:      transparent;
  border-top:      1px solid var(--border-subtle);
  border-bottom:   1px solid var(--border-subtle);
  z-index:         10;
  transition:      background var(--transition-fast);
  user-select:     none;
}
.acp-splitter:hover { background: var(--accent-muted); }
.acp-splitter-dots {
  width:            28px;
  height:           3px;
  border-radius:    99px;
  background:       var(--border-strong);
  transition:       background var(--transition-fast);
}
.acp-splitter:hover .acp-splitter-dots { background: var(--accent); }

/* Response section wrapper — fills the remaining space */
.acp-response-wrap {
  flex:       1;
  min-height: 0;
  overflow:   hidden;
  display:    flex;
  flex-direction: column;
}
.acp-response-wrap > * { flex: 1; min-height: 0; }

@media (max-width: 767px) {
  .acp         { height: auto; }
  .acp-layout  { flex-direction: column; overflow: visible; height: auto; }
  .acp-right   { overflow: visible; height: auto; }
  .acp-splitter { display: none; }
  /* Request tab */
  .acp-right[data-mobile-tab="request"] .acp-request-wrap  { height: auto !important; overflow: visible; }
  .acp-right[data-mobile-tab="request"] .acp-response-wrap { display: none; }
  /* Response tab */
  .acp-right[data-mobile-tab="response"] .acp-request-wrap { display: none; }
  .acp-right[data-mobile-tab="response"] .acp-response-wrap {
    display: flex; flex: unset; min-height: 60dvh; overflow: visible;
  }
}

/* ── Mobile tab bar ── */
.acp-mobile-tabs { display: none; }
@media (max-width: 767px) {
  .acp-mobile-tabs {
    display:       flex;
    flex-shrink:   0;
    background:    var(--bg-surface);
    border:        1px solid var(--border-default);
    border-radius: var(--radius-lg);
    overflow:      hidden;
    margin-bottom: 8px;
  }
}
.acp-mobile-tab {
  flex:            1;
  display:         flex; align-items: center; justify-content: center;
  gap:             6px;
  height:          44px;
  background:      transparent; border: none;
  color:           var(--text-tertiary);
  font-size:       var(--text-sm); font-family: var(--font-sans); font-weight: 500;
  cursor:          pointer;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.acp-mobile-tab:hover     { background: var(--bg-overlay); color: var(--text-primary); }
.acp-mobile-tab--active   { background: var(--bg-overlay); color: var(--text-primary); }
.acp-mobile-tab-badge {
  font-size:     var(--text-xs); font-weight: 700; font-family: var(--font-mono);
  padding:       1px 7px; border-radius: 99px;
  background:    var(--bg-elevated); border: 1px solid var(--border-default);
}

/* Save form */
.save-form-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 479px) { .save-form-grid { grid-template-columns: 1fr; } }
.save-form-field { display: flex; flex-direction: column; gap: 6px; }
.save-form-label { font-size: var(--text-sm); font-weight: 500; color: var(--text-primary); display: flex; align-items: center; gap: 6px; }
.save-form-optional { font-size: var(--text-xs); font-weight: 400; color: var(--text-tertiary); }
.save-form-check { display: flex; align-items: center; gap: 10px; cursor: pointer; position: relative; width: fit-content; }
.sf-check-box {
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  background: var(--bg-subtle); border: 1px solid var(--border-default);
  border-radius: var(--radius-sm); flex-shrink: 0;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}
.sf-check-box--on { background: var(--accent); border-color: var(--accent); color: white; }
.save-form-check-label { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--text-secondary); }

/* Delete confirm */
.del-confirm         { display: flex; flex-direction: column; gap: 20px; }
.del-confirm-text    { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.del-confirm-text strong { color: var(--text-primary); }
.del-confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }

/* Draft restored notice */
.acp-draft-notice {
  display:       flex;
  align-items:   center;
  gap:           8px;
  padding:       8px 14px;
  background:    var(--accent-muted);
  border:        1px solid var(--accent-border);
  border-radius: var(--radius-md);
  color:         var(--cyan-300);
  font-size:     var(--text-xs);
  flex-shrink:   0;
}
.acp-draft-dismiss {
  margin-left:     auto;
  display:         flex; align-items: center; justify-content: center;
  width:           22px; height: 22px;
  background:      transparent; border: none;
  border-radius:   var(--radius-sm); color: var(--cyan-300); cursor: pointer;
  transition:      background var(--transition-fast);
}
.acp-draft-dismiss:hover { background: var(--accent-border); }
`;
