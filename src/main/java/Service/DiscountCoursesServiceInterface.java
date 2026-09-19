package Service;

import java.util.List;

import com.hachionUserDashboard.dto.DiscountCousesRequest;
import com.hachionUserDashboard.dto.DiscountCousesResponse;

public interface DiscountCoursesServiceInterface {

	public DiscountCousesResponse createCouponCode(DiscountCousesRequest discountCousesRequest);

	public DiscountCousesResponse updateCouponCode(DiscountCousesRequest discountCousesRequest);

	public void deleteCouponCode(Long discountId);

	public List<DiscountCousesResponse> getAlCouponCodeDetails();

//	public List<Object[]> getDiscountByCouponCode(String couponCode);
//	public Map<String, Object> getDiscountByCouponCode(String couponCode);
}
