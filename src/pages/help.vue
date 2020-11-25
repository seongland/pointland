<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col lg="6" md="8" sm="12">
        <v-card class="elevation-24">
          <v-toolbar dark flat>
            <v-toolbar-title><span>시설물</span> 도화 사용법</v-toolbar-title>
          </v-toolbar>

          <v-card-title>단축키</v-card-title>
          <v-divider />

          <v-card-subtitle>전역 단축키</v-card-subtitle>
          <v-card-text>
            <kbd>Enter</kbd> - 도화 데이터를 제출한다 - 제출할 데이터가 없으면 시설물을 새로고침한다
          </v-card-text>
          <v-card-text><kbd>Escape</kbd> - 선택해제 - 해제할 데이터가 없으가 시설물을 새로고침한다</v-card-text>
          <v-card-text><kbd>Delete</kbd> - 맵에서 선택한 시설물을 삭제한다</v-card-text>

          <v-card-subtitle>Cloud 단축키</v-card-subtitle>
          <v-card-text><kbd>ctrl + f</kbd> - 현재 선택한 포인트를 포커싱한다</v-card-text>
          <v-card-text><kbd>ctrl + shift + f</kbd> - 현재 마우스 포인트를 포커싱한다</v-card-text>

          <v-card-subtitle>이동 단축키 </v-card-subtitle>
          <v-card-text><kbd>Space</kbd> - 현재 마크를 포커싱한다 </v-card-text>
          <v-card-text><kbd>ctrl + &lt;</kbd> - 이전 마크로 이동한다 </v-card-text>
          <v-card-text><kbd>ctrl + &gt;</kbd> - 다음 마크로 이동한다 </v-card-text>

          <v-card-subtitle>UI 단축키 </v-card-subtitle>
          <v-card-text><kbd>ctrl + m</kbd> - 지도 뷰를 토글한다</v-card-text>
          <v-card-text><kbd>ctrl + 1</kbd> - Map View로 이동한다</v-card-text>
          <v-card-text><kbd>ctrl + 2</kbd> - Image View로 이동한다</v-card-text>
          <v-card-text><kbd>ctrl + 3</kbd> - Cloud View로 이동한다 </v-card-text>

          <v-card-title>UI </v-card-title>
          <v-divider />
          <v-card-subtitle>메인 뷰</v-card-subtitle>
          <v-card-text><kbd>지도</kbd> - 탑뷰를 볼 수 있다</v-card-text>
          <v-card-text><kbd>영상이미지</kbd> - 해당 위치에서 카메라 촬영 이미지</v-card-text>
          <v-card-text><kbd>클라우드</kbd> - 3D View</v-card-text>

          <v-card-subtitle>서브 뷰</v-card-subtitle>
          <v-card-text><kbd>상단 바</kbd> - 작업할 대상을 정한다</v-card-text>
          <v-card-text><kbd>도구</kbd> - 좌측에 있으며 어떤 시설물을 도화할 지 정한다</v-card-text>
          <v-card-text><kbd>컨트롤 바</kbd> - 우측에 있으며 도화할 대상을 선택하거나 필터링한다</v-card-text>

          <v-card-title>Caution </v-card-title>
          <v-divider />
          <v-card-text>1. 오류 발생 시 캡쳐 후 새로고침을 한다</v-card-text>
          <v-card-text>2. 이미지에서는 클릭, Cloud에서는 더블클릭으로 포인트를 선택한다</v-card-text>
          <v-card-text>3. 레이어를 선택해야 포인트를 선택할 수 있다</v-card-text>
          <v-card-text>4. 현재는 표지판, 신호등 레이어만 도화가 가능하다</v-card-text>
          <v-card-text>5. 클라우드 뷰가 느려진 경우 브라우저를 종료했다가 새로 킨다</v-card-text>

          <v-card-title>예시</v-card-title>
          <v-divider />
          <v-card-text><kbd>전체</kbd></v-card-text>
          <v-img src="/example/total.jpg" />
          <v-card-text><kbd>표지판</kbd></v-card-text>
          <v-img src="/example/B1_SAFETYSIGN_1.png" />
          <v-img src="/example/B1_SAFETYSIGN_2.png" />
          <v-img src="/example/B1_SAFETYSIGN_3.png" />
          <v-card-text><kbd>신호등</kbd></v-card-text>
          <v-img src="/example/C1_TRAFFICLIGHT_1.png" />

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
