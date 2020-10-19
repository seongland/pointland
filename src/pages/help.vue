<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col lg="6" md="8" sm="12">
        <v-card class="elevation-24">
          <v-toolbar dark flat>
            <v-toolbar-title><span style="font-weight: bold">시설물</span> 도화 설명서</v-toolbar-title>
          </v-toolbar>

          <v-card-title>UI </v-card-title>
          <v-divider />
          <v-card-text><span style="font-weight: bold">상단 바</span> - 라운드, 스냅, 마크를 정한다</v-card-text>
          <v-img src="/help/bar.png" />
          <v-card-text><span style="font-weight: bold">도구</span> - 어떤 시설물을 그릴지 정한다</v-card-text>
          <v-img src="/help/tools.png" />

          <v-card-title>단축키</v-card-title>
          <v-divider />

          <v-card-title>전역 단축키</v-card-title>
          <v-card-text>
            <span style="font-weight: bold">Space</span> - 현재 마크로 이동한다 (포인트클라우드 뷰가 이상할 때 사용한다)
          </v-card-text>
          <v-img src="/help/focus.png" />
          <v-card-text><span style="font-weight: bold">Enter</span> - Submit Facility</v-card-text>
          <v-card-text> <span style="font-weight: bold">&lt;</span> - Move to Previous Mark </v-card-text>
          <v-card-text> <span style="font-weight: bold">&gt;</span> - Move to Next Mark </v-card-text>

          <v-card-title>Map Keyboard Shortcuts </v-card-title>

          <v-card-title>Image Keyboard Shortcuts </v-card-title>
          <v-card-text><span style="font-weight: bold">M</span> - Toggle Map</v-card-text>
          <v-card-text><span style="font-weight: bold">D</span> - Toggle Depth Map</v-card-text>
          <v-card-title>Cloud Keyboard Shortcuts </v-card-title>
          <v-card-text><span style="font-weight: bold">M</span> - Toggle Map</v-card-text>

          <v-card-title>Caution </v-card-title>
          <v-divider />
          <v-card-text>1. 잘 작동하지 않을 때에는 새로고침을 한다</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$router.push('/draw')">
              Go to Draw
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'help',
  middleware: 'authentication',
  layout: 'before'
}
</script>
