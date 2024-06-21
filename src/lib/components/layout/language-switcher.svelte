<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$components/ui/button";
  import * as DropdownMenu from "$components/ui/dropdown-menu";
  import { i18n } from "$lib/i18n";
  import { availableLanguageTags, languageTag } from "$paraglide/runtime";

  const flags = {
    en: "🇺🇸",
    it: "🇮🇹",
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" size="icon">{flags[languageTag()]}</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="min-w-10 max-w-10">
    {#each availableLanguageTags as lang}
      <DropdownMenu.Item>
        <!-- the hreflang attribute decides which language the link points to -->
        <a href={i18n.route($page.url.pathname)} hreflang={lang} aria-current={lang === languageTag() ? "page" : undefined}>
          {flags[lang]}
        </a>
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
