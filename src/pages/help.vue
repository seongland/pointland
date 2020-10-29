<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col lg="6" md="8" sm="12">
        <v-card class="elevation-24">
          <v-toolbar dark flat>
            <v-toolbar-title><span style="font-weight: bold">시설물</span> 도화 설명서</v-toolbar-title>
          </v-toolbar>

          <v-card-title>예시</v-card-title>
          <v-divider />
          <v-card-text><span style="font-weight: bold">표지판</span></v-card-text>
          <v-img src="/example/B1_SAFETYSIGN_1.png" />
          <v-img src="/example/B1_SAFETYSIGN_2.png" />
          <v-img src="/example/B1_SAFETYSIGN_3.png" />
          <v-card-text><span style="font-weight: bold">신호등</span></v-card-text>
          <v-img src="/example/C1_TRAFFICLIGHT_1.png" />

          <v-card-title>단축키</v-card-title>
          <v-divider />

          <v-card-title>전역 단축키</v-card-title>
          <v-card-text>
            <span style="font-weight: bold">Space</span> - 현재 마크로 이동한다 (포인트클라우드 뷰가 이상할 때 사용한다)
          </v-card-text>
          <v-img src="/help/focus.png" />
          <v-card-text><span style="font-weight: bold">1</span> - Map View로 이동한다</v-card-text>
          <v-card-text><span style="font-weight: bold">2</span> - Image View로 이동한다</v-card-text>
          <v-card-text><span style="font-weight: bold">3</span> - Cloud View로 이동한다 </v-card-text>

          <v-card-text><span style="font-weight: bold">Enter</span> - 도화 데이터를 제출한다</v-card-text>
          <v-card-text><span style="font-weight: bold">F</span> - 현재 선택한 포인트를 포커싱한다</v-card-text>
          <v-card-text><span style="font-weight: bold">&lt;</span> - 이전 마크로 이동한다 </v-card-text>
          <v-card-text><span style="font-weight: bold">&gt;</span> - 다음 마크로 이동한다 </v-card-text>
          <v-card-text><span style="font-weight: bold">Delete</span> - 맵에서 선택한 시설물을 삭제한다</v-card-text>

          <v-card-title>UI 단축키 </v-card-title>
          <v-card-text><span style="font-weight: bold">M</span> - 지도 뷰를 토글한다</v-card-text>

          <v-card-title>UI </v-card-title>
          <v-divider />
          <v-card-text><span style="font-weight: bold">상단 바</span> - 라운드, 스냅, 마크를 정한다</v-card-text>
          <v-img src="/help/bar.png" />
          <v-card-text><span style="font-weight: bold">도구</span> - 어떤 시설물을 그릴지 정한다</v-card-text>
          <v-img src="/help/tools.png" />
          <v-card-text><span style="font-weight: bold">지도</span> - 마크를 클릭하여 이동할 수 있다</v-card-text>

          <v-card-title>Caution </v-card-title>
          <v-divider />
          <v-card-text>1. 잘 작동하지 않을 때에는 새로고침을 한다</v-card-text>
          <v-card-text>2. 이미지에서는 클릭, Cloud에서는 더블클릭으로 포인트를 선택한다</v-card-text>
          <v-card-text>3. 레이어를 선택해야 포인트를 선택할 수 있다</v-card-text>
          <v-card-text>4. 현재는 표지판, 신호등 레이어만 도화가 가능하다</v-card-text>

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
