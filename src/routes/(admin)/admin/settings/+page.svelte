<script lang="ts">
  import * as Card from "$components/ui/card";
  import * as m from "$paraglide/messages";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="text-2xl">{m.settings()}</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
